package Koha::LMSCloud::EventManagement::Event;

use Modern::Perl;

use base qw(Koha::Object);

=head1 NAME

Koha::LMSCloud::EventManagement::Event - Koha LMSCloud EventManagement Event Object class

=head1 API

=head2 Internal methods

=head3 _type

=cut

sub _type {
    return 'KohaPluginComLmscloudEventmanagementEvent';
}

1;
