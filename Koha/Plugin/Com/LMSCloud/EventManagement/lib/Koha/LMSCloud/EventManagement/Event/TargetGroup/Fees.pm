package Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees;

use Modern::Perl;

use Koha::LMSCloud::EventManagement::Event::TargetGroup::Fee;

use base qw(Koha::Objects);

=head1 NAME

Koha::FancyWord - Koha Fancy Word Object set class

=head1 API

=head2 Internal methods

=head3 _type

=cut

sub _type {
    return 'KohaPluginComLmscloudEventmanagementETgFee';
}

=head3 object_class

=cut

sub object_class {
    return 'Koha::LMSCloud::EventManagement::Event::TargetGroup::Fee';
}

1;
