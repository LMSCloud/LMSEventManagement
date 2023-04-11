package Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fees;

use Modern::Perl;

use Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fee;

use base qw(Koha::Objects);

=head1 NAME

Koha::FancyWord - Koha Fancy Word Object set class

=head1 API

=head2 Internal methods

=head3 _type

=cut

sub _type {
    return 'KohaPluginComLmscloudEventmanagementEtTgFee';
}

=head3 object_class

=cut

sub object_class {
    return 'Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fee';
}

1;
