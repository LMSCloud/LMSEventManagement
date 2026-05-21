package Koha::Plugin::Com::LMSCloud::EventManagement::Util::MigrationHelper;

use Modern::Perl;
use utf8;

use Carp           qw( carp croak );
use English        qw( -no_match_vars );
use File::Spec     ();
use File::Basename qw( fileparse );
use Moose;
use Readonly  ();
use Try::Tiny qw( catch try );

use C4::Context ();

our $VERSION = '1.0.0';

Readonly::Scalar my $CURRENT_MIGRATION_KEY => '__CURRENT_MIGRATION__';

has 'dbh' => (
    is      => 'ro',
    default => sub { C4::Context->dbh },
);

has 'table_name_mappings' => (
    is       => 'ro',
    isa      => 'HashRef',
    required => 1,           # Require this on object creation
);

has 'bundle_path' => (
    is       => 'ro',
    isa      => 'Str',
    required => 1,           # Require this on object creation
);

sub install() {
    my ( $self, $args ) = @_;

    return try {
        my @migration_files = $self->_get_migration_files();

        # Loop over migration files and apply each one
        my $last_migration;
        for my $file (@migration_files) {
            $self->dbh->begin_work;

            my $is_success = $self->_apply_migration( { file => $file } );

            if ( !$is_success ) {
                $self->dbh->rollback;
                carp "Failed to apply migration from $file. Aborting installation.";
                return 0;
            }

            $self->dbh->commit;

            my $number = $self->_extract_migration_number($file);
            $last_migration = $number;

            carp "Successfully applied migration from $file.";
        }

        # Store the last migration
        if ( defined $last_migration ) {
            $args->{plugin}->store_data( { $CURRENT_MIGRATION_KEY => $last_migration } );
        }

        return 1;
    }
    catch {
        my $error = $_;
        carp "INSTALLATION ERROR: $error";

        return 0;
    };
}

sub upgrade() {
    my ( $self, $args ) = @_;

    return try {
        my $last_migration = $args->{plugin}->retrieve_data($CURRENT_MIGRATION_KEY);

        # Defend against the counter outliving the schema. If uninstall()
        # dropped the tables without clearing plugin_data, retrieve_data
        # still returns the old high-water mark and the loop below would
        # skip every migration, leaving the schema empty. Treat that case
        # as a fresh install — the CREATE TABLE / CREATE INDEX statements
        # are idempotent, and later ALTER migrations only re-run when
        # their predecessor really hasn't been applied.
        if ( defined $last_migration && !$self->_schema_is_present ) {
            carp "__CURRENT_MIGRATION__=$last_migration but no plugin tables exist; re-applying all migrations.";
            $last_migration = 0;
        }

        if ( !defined $last_migration ) {
            carp <<~"MESSAGE";
                No last migration found. This is likely a mistake as there should
                be a last migration number stored after installation. If it's missing
                you should run the following statement in the DB:

                INSERT INTO plugin_data (plugin_class, plugin_key, plugin_value)
                VALUES (
                    'Koha::Plugin::Com::LMSCloud::EventManagement',
                    '__CURRENT_MIGRATION__',
                    '<initial_migration_number>'
                );

                where <initial_migration_number> is the number of the initial schema.
            MESSAGE

            return 0;
        }

        my @migration_files = $self->_get_migration_files();
        my $is_success      = 1;
        for my $file (@migration_files) {
            my $number = $self->_extract_migration_number($file);

            # skip migrations that have been applied already
            next if $number <= $last_migration;

            $self->dbh->begin_work;    # Start transaction

            $is_success = $self->_apply_migration( { file => $file } );
            if ( !$is_success ) {
                $self->dbh->rollback;    # Rollback transaction
                carp "Failed to apply migration from $file. Aborting upgrade.";
                return 0;
            }

            $self->dbh->commit;          # Commit transaction

            # update last_migration
            $args->{plugin}->store_data( { $CURRENT_MIGRATION_KEY => $number } );

            carp "Successfully applied migration from $file.";
        }

        return $is_success;

    }
    catch {
        my $error = $_;
        if ( $self->dbh->in_transaction ) {
            $self->dbh->rollback;    # Rollback transaction if inside transaction block
        }
        carp "UPGRADE ERROR: $error";
        return 0;
    };
}

sub _schema_is_present {
    my ($self) = @_;

    my @table_names
        = map  { $self->table_name_mappings->{$_} }
          grep { !/_idx$/smx }
          keys %{ $self->table_name_mappings || {} };

    return 1 unless @table_names;

    my $placeholders = join q{,}, (q{?}) x scalar @table_names;
    my $sth          = $self->dbh->prepare(
        "SELECT COUNT(*) FROM information_schema.tables
         WHERE table_schema = DATABASE() AND table_name IN ($placeholders)"
    );
    $sth->execute(@table_names);
    my ($count) = $sth->fetchrow_array;

    return $count ? 1 : 0;
}

sub _get_migration_files {
    my ($self) = @_;

    my $migrations_path = File::Spec->catdir( $self->bundle_path, 'migrations' );

    # List all SQL files in migrations directory
    my @migration_files = glob "$migrations_path/*.sql";

    # Extract numbers from filenames and sort based on the numbers
    my @sorted_files = map { $_->[0] }
        sort { $a->[1] <=> $b->[1] }
        map { [ $_, ( fileparse($_) =~ m{(\d+)_?.*}smx ) ] } @migration_files;

    return @sorted_files;
}

sub _apply_migration {
    my ( $self, $args ) = @_;
    my $file = $args->{file};

    return try {
        local $INPUT_RECORD_SEPARATOR = undef;    # Enable slurp mode

        open my $fh, '<:encoding(UTF-8)', $file or croak "Can't open $file: $OS_ERROR";
        my $sql = <$fh>;
        close $fh or croak "Can't close $file: $OS_ERROR";

        for my $table ( keys %{ $self->table_name_mappings } ) {
            my $ws         = '\s*';                     # Whitespace character class
            my $ob         = '\{';                      # Opening brace character class
            my $cb         = '\}';                      # Closing brace character class
            my $table_name = '\s*' . $table . '\s*';    # Table name wrapped with optional whitespace

            my $pattern = $ob . $ws . $ob . $table_name . $cb . $ws . $cb;

            my $table_identifier = $self->table_name_mappings->{$table};
            $sql =~ s/$pattern/$table_identifier/smxg;
        }

        my $statements = [ split /;\s*\n/smx, $sql ];
        for my $statement ( @{$statements} ) {
            my $sth = $self->dbh->prepare($statement);
            croak "Failed to prepare statement: $statement. DBI error: " . $self->dbh->errstr if !defined $sth;

            my $rows_affected = $sth->execute;
            croak "Failed to execute statement: $statement. DBI error: " . $sth->errstr if not defined $rows_affected;
        }
        return 1;
    }
    catch {
        my $error = $_;
        carp "MIGRATION ERROR for $file: $error";

        return 0;
    };
}

sub _extract_migration_number {
    my ( $self, $file ) = @_;

    my ($filename) = fileparse($file);
    my ($number)   = ( $filename =~ m{(\d+)_?.*}smx );    # extract number from file name

    return $number;
}

__PACKAGE__->meta->make_immutable;

1;
