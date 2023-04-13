package Koha::LMSCloud::EventManagement::Locations;

use Modern::Perl;

use Koha::LMSCloud::EventManagement::Location;

use base qw(Koha::Objects);

=head1 NAME

Koha::LMSCloud::EventManagement::Locations - Koha LMSCloud EventManagement Locations Object set class

=head1 API

=head2 Internal methods

=head3 _type

=cut

sub _type {
    return 'KohaPluginComLmscloudEventmanagementLocation';
}

=head3 object_class

=cut

sub object_class {
    return 'Koha::LMSCloud::EventManagement::Location';
}

1;
