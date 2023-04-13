package Koha::LMSCloud::EventManagement::Location;

use Modern::Perl;

use base qw(Koha::Object);

=head1 NAME

Koha::LMSCloud::EventManagement::Location - Koha LMSCloud EventManagement Location Object class

=head1 API

=head2 Internal methods

=head3 _type

=cut

sub _type {
    return 'KohaPluginComLmscloudEventmanagementLocation';
}

1;
