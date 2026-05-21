package Koha::Plugin::Com::LMSCloud::EventManagement::Util::Reporting::Metric::TopN;

use Modern::Perl;
use utf8;

use Carp qw( croak );
use Moose;

use Koha::Plugin::Com::LMSCloud::EventManagement::Util::Reporting::Types qw( $TOP_N );

extends 'Koha::Plugin::Com::LMSCloud::EventManagement::Util::Reporting::Metric';

our $VERSION = '1.0.0';

has 'limit_n' => (
    is      => 'ro',
    isa     => 'Int',
    default => 10,
);

sub type { return $TOP_N }

## no critic qw(Subroutines::ProhibitUnusedPrivateSubroutines ValuesAndExpressions::RequireInterpolationOfMetachars)
# Template method invoked by base compute(); the LIMIT-guard message
# carries literal `$self->limit_n` text as documentation, not interpolation.
sub _postprocess {
    my ( $self, $sth ) = @_;

    # The author's SQL must carry its own LIMIT (using $self->limit_n as
    # the bind value) because we can't rewrite arbitrary user SQL safely.
    # We check here so the failure mode is a clear croak rather than a
    # silent OOM on big tables.
    my $sql = $sth->{Statement} // q{};
    croak 'Reporting::Metric::TopN: SQL must include a LIMIT clause (use $self->limit_n as the bind value)'
        if $sql !~ m{\bLIMIT\b}smxi;

    my $items = $self->_coerce_rows( $sth, [qw( label value )] );
    return { items => $items };
}
## use critic

__PACKAGE__->meta->make_immutable;

1;
