package Koha::LMSCloud::EventManagement::EventTypes;

use Modern::Perl;

use Koha::LMSCloud::EventManagement::EventType ();

use base qw(Koha::Objects);

=head1 NAME

Koha::LMSCloud::EventManagement::EventTypes - Koha LMSCloud EventManagement EventTypes Object set class

=head1 API

=head2 Internal methods

=head3 _type

=cut

sub _type {
    return 'KohaPluginComLmscloudEventmanagementEventType';
}

=head3 object_class

=cut

sub object_class {
    return 'Koha::LMSCloud::EventManagement::EventType';
}

1;
