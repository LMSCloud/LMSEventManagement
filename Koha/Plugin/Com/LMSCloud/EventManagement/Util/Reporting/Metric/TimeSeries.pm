package Koha::Plugin::Com::LMSCloud::EventManagement::Util::Reporting::Metric::TimeSeries;

use Modern::Perl;
use utf8;

use Carp qw( croak );
use Moose;
use Moose::Util::TypeConstraints qw( enum );
use Readonly                     qw( Readonly );

use Koha::Plugin::Com::LMSCloud::EventManagement::Util::Reporting::Types qw(
    $TIME_SERIES @BUCKETS
    $BUCKET_DAY $BUCKET_WEEK $BUCKET_MONTH
);

extends 'Koha::Plugin::Com::LMSCloud::EventManagement::Util::Reporting::Metric';

our $VERSION = '1.0.0';

# Single source of truth for bucket → MariaDB grouping expression. Adding
# a new bucket means a single new entry here + the enum below.
# Authors must keep a sargable range predicate (e.g. WHERE col BETWEEN ?
# AND ?) on the underlying column — these functions are not indexable,
# so the range predicate is what keeps GROUP BY scans bounded.
Readonly my %BUCKET_SQL => (
    $BUCKET_DAY   => sub { my ($col) = @_; return "DATE($col)" },
    $BUCKET_WEEK  => sub { my ($col) = @_; return "DATE_FORMAT($col, '%x-W%v')" },
    $BUCKET_MONTH => sub { my ($col) = @_; return "DATE_FORMAT($col, '%Y-%m')" },
);

has 'bucket' => (
    is      => 'ro',
    isa     => enum( [@BUCKETS] ),
    default => $BUCKET_DAY,
);

sub type { return $TIME_SERIES }

sub _postprocess {    ## no critic qw(Subroutines::ProhibitUnusedPrivateSubroutines)
    my ( $self, $sth ) = @_;

    my $series = $self->_coerce_rows( $sth, [qw( bucket value )] );
    return {
        bucket => $self->bucket,
        series => $series,
    };
}

sub bucket_expression {
    my ( $self, $column ) = @_;

    croak 'bucket_expression requires a column name'
        if !defined $column || $column eq q{};

    my $builder = $BUCKET_SQL{ $self->bucket }
        or croak 'Unknown bucket granularity: ' . $self->bucket;

    return $builder->($column);
}

__PACKAGE__->meta->make_immutable;

1;
