package Koha::Plugin::Com::LMSCloud::EventManagement::lib::MigrationHelper;

use Modern::Perl;
use utf8;
use 5.032;

use Carp;
use English qw( -no_match_vars );
use File::Spec;
use File::Basename;
use Moose;
use Readonly;
use Try::Tiny;

use C4::Context;

our $VERSION = '1.0.0';

Readonly::Scalar my $INIT => -1;

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

    my @migration_files = $self->_get_migration_files();

    # Loop over migration files and apply each one
    for my $file (@migration_files) {
        $self->_apply_migration( { file => $file } );
    }

    return 1;
}

sub upgrade() {
    my ( $self, $args ) = @_;

    my $last_migration_file = 'last_migration.txt';
    my $last_migration      = $INIT;                  # Initialize to a value that indicates no migrations have been applied yet.
    if ( -e $last_migration_file ) {
        open my $fh, '<', $last_migration_file or croak "Can't open $last_migration_file: $OS_ERROR";
        $last_migration = <$fh>;
        close $fh or croak "Can't close $last_migration_file: $OS_ERROR";
    }

    my @migration_files = $self->_get_migration_files();

    for my $file (@migration_files) {
        my ($number) = ( $file =~ /(\d+)/smx );    # extract number from file name

        # skip migrations that have been applied already
        next if $number <= $last_migration;

        $self->_apply_migration( { file => $file } );

        # update last_migration
        open my $fh, '>>', $last_migration_file or croak "Can't open $last_migration_file: $OS_ERROR";
        print {$fh} $number or croak "Can't write to $last_migration_file: $OS_ERROR";
        close $fh           or croak "Can't close $last_migration_file: $OS_ERROR";
    }

    return 1;
}

sub _get_migration_files {
    my ($self) = @_;

    my $migrations_path = File::Spec->catdir( $self->bundle_path, 'migrations' );

    # List all SQL files in migrations directory
    my @migration_files = glob "$migrations_path/*.sql";

    # Sort files based on the numerical part in their filenames
    @migration_files = sort { ( $a =~ /(\d+)/smx )[0] <=> ( $b =~ /(\d+)/smx )[0] } @migration_files;

    return @migration_files;
}

sub _apply_migration {
    my ( $self, $args ) = @_;
    my $file = $args->{file};

    return try {
        local $INPUT_RECORD_SEPARATOR = undef;    # Enable slurp mode

        open my $fh, '<', $file or croak "Can't open $file: $OS_ERROR";
        my $sql = <$fh>;
        close $fh or croak "Can't close $file: $OS_ERROR";

        for my $table ( keys %{ $self->table_name_mappings } ) {
            my $ws         = '\s*';                     # Whitespace character class
            my $ob         = '\{';                      # Opening brace character class
            my $cb         = '\}';                      # Closing brace character class
            my $table_name = '\s*' . $table . '\s*';    # Table name wrapped with optional whitespace

            my $pattern = $ob . $ws . $ob . $table_name . $cb . $ws . $cb;

            my $table_identifier = $self->table_name_mappings->{$table};
            warn $table_identifier;
            $sql =~ s/$pattern/$table_identifier/smxg;
        }

        my $statements = [ split /;\s*\n/smx, $sql ];
        for my $statement ( @{$statements} ) {
            warn $statement;
            $self->dbh->do($statement);
        }
        return 1;
    }
    catch {
        my $error = $_;
        carp "MIGRATION ERROR for $file: $error";

        return 0;
    };
}

__PACKAGE__->meta->make_immutable;

1;
