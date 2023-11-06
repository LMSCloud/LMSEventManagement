package Koha::LMSCloud::EventManagement::Event;

use Modern::Perl;

use base qw(Koha::Object);

use Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees;

=head1 NAME

Koha::LMSCloud::EventManagement::Event - Koha LMSCloud EventManagement Event Object class

=head1 API

=head2 Class methods

=head3 associated_target_group_fees

=cut

sub associated_target_group_fees {
    my ($self) = @_;

    my $fees_rs = Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees->new;

    return $fees_rs->search( { event_id => $self->id }, { columns => [ 'event_id', 'target_group_id', 'fee', 'selected' ] } );
}

=head2 Internal methods

=head3 _type

=cut

sub _type {
    return 'KohaPluginComLmscloudEventmanagementEvent';
}

1;
