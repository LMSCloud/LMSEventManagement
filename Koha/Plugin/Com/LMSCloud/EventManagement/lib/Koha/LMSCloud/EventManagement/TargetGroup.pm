package Koha::LMSCloud::EventManagement::TargetGroup;

use Modern::Perl;

use base qw(Koha::Object);

=head1 NAME

Koha::LMSCloud::EventManagement::TargetGroup - Koha LMSCloud EventManagement TargetGroup Object class

=head1 API

=head2 Internal methods

=head3 _type

=cut

sub _type {
    return 'KohaPluginComLmscloudEventmanagementTargetGroup';
}

1;
