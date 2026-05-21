package Koha::Plugin::Com::LMSCloud::EventManagement::Util::Reporting::Metric::Counter;

use Modern::Perl;
use utf8;

use Moose;

use Koha::Plugin::Com::LMSCloud::EventManagement::Util::Reporting::Types qw( $COUNTER );

extends 'Koha::Plugin::Com::LMSCloud::EventManagement::Util::Reporting::Metric';

our $VERSION = '1.0.0';

sub type { return $COUNTER }

sub _postprocess {    ## no critic qw(Subroutines::ProhibitUnusedPrivateSubroutines)
    my ( $self, $sth ) = @_;

    my ($value) = $sth->fetchrow_array;
    return { value => ( $value // 0 ) + 0 };
}

__PACKAGE__->meta->make_immutable;

1;
