package Koha::LMSCloud::EventManagement::EventType;

use Modern::Perl;

use base qw(Koha::Object);

=head1 NAME

Koha::LMSCloud::EventManagement::EventType - Koha LMSCloud EventManagement EventType Object class

=head1 API

=head2 Internal methods

=head3 _type

=cut

sub _type {
    return 'KohaPluginComLmscloudEventmanagementEventType';
}

1;
