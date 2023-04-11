package Koha::LMSCloud::EventManagement::Location;

use Modern::Perl;

use base qw(Koha::Object);

=head1 NAME

Koha::FancyWord - Koha Fancy Word Object class

=head1 API

=head2 Internal methods

=head3 _type

=cut

sub _type {
    return 'KohaPluginComLmscloudEventmanagementLocation';
}

1;
