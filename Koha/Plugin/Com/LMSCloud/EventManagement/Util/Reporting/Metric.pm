package Koha::Plugin::Com::LMSCloud::EventManagement::Util::Reporting::Metric;

use Modern::Perl;
use utf8;

use Carp qw( croak );
use Moose;

our $VERSION = '1.0.0';

has 'id' => (
    is       => 'ro',
    isa      => 'Str',
    required => 1,
);

has 'label' => (
    is       => 'ro',
    isa      => 'Str',
    required => 1,
);

has 'description' => (
    is      => 'ro',
    isa     => 'Str',
    default => q{},
);

# Lazy C4::Context load so the harness is unit-testable outside Koha — tests
# inject a DBI handle directly. In a Koha runtime the require is free (already
# loaded by the plugin host) and the closure runs at most once per instance.
has 'dbh' => (
    is      => 'ro',
    default => sub { require C4::Context; C4::Context->dbh },
);

has 'scope' => (
    is       => 'ro',
    isa      => 'Koha::Plugin::Com::LMSCloud::EventManagement::Util::Reporting::Scope',
    required => 1,
);

sub type { croak 'Reporting::Metric->type is abstract — subclasses must implement it' }

sub _postprocess {
    croak 'Reporting::Metric->_postprocess is abstract — subclasses must implement it returning a hashref of envelope extras';
}

## no critic qw(ValuesAndExpressions::RequireInterpolationOfMetachars)
# Sigils in the error string are literal docs of the expected return shape.
sub _query {
    croak 'Reporting::Metric->_query is abstract — subclasses must implement it returning ($sql, \@bind)';
}
## use critic

sub compute {
    my ($self) = @_;

    my $sth   = $self->_run_query;
    my $extra = $self->_postprocess($sth);
    $sth->finish;    # release any unread rows promptly; harmless if already drained

    return $self->_envelope( %{$extra} );
}

sub _run_query {
    my ($self) = @_;

    my ( $sql, $bind ) = $self->_query;
    croak 'Reporting::Metric->_query must return (sql, [bind])' if !defined $sql;
    $bind //= [];

    # Koha's dbh has RaiseError => 1, so prepare/execute throw on failure;
    # no need to test their return values defensively.
    my $sth = $self->dbh->prepare_cached($sql);
    $sth->execute( @{$bind} );

    return $sth;
}

## no critic qw(Subroutines::ProhibitUnusedPrivateSubroutines)
# Called from subclass _postprocess implementations across the package.
sub _coerce_rows {
    my ( $self, $sth, $required_columns ) = @_;

    my $rows = $sth->fetchall_arrayref( {} ) || [];
    for my $row ( @{$rows} ) {
        for my $col ( @{$required_columns} ) {
            croak "Reporting::Metric: row missing required column '$col'"
                if !exists $row->{$col};
        }
        $row->{value} += 0 if exists $row->{value};
    }

    return $rows;
}

sub _envelope {
    my ( $self, %extra ) = @_;

    return {
        id          => $self->id,
        label       => $self->label,
        description => $self->description,
        type        => $self->type,
        %extra,
    };
}

__PACKAGE__->meta->make_immutable;

1;
