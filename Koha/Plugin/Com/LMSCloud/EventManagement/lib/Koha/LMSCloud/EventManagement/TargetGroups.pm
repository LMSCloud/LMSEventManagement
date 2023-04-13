package Koha::LMSCloud::EventManagement::TargetGroups;

use Modern::Perl;

use Koha::LMSCloud::EventManagement::TargetGroup;

use base qw(Koha::Objects);

=head1 NAME

Koha::LMSCloud::EventManagement::TargetGroups - Koha LMSCloud EventManagement TargetGroups Object set class

=head1 API

=head2 Internal methods

=head3 _type

=cut

sub _type {
    return 'KohaPluginComLmscloudEventmanagementTargetGroup';
}

=head3 object_class

=cut

sub object_class {
    return 'Koha::LMSCloud::EventManagement::TargetGroup';
}

1;
