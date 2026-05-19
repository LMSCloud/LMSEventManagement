package Koha::LMSCloud::EventManagement::Attendees;

use Modern::Perl;

use Koha::Database ();

use Koha::LMSCloud::EventManagement::Attendee ();

use base qw(Koha::Objects);

=head1 NAME

Koha::LMSCloud::EventManagement::Attendees - resultset for attendees

=head1 API

=head2 count_active_for_event($event_id)

Count attendees that consume capacity on the given event: rows in C<pending>
or C<confirmed> status. Waitlisted, canceled, attended (post-event) and
no_show rows are excluded.

=cut

sub count_active_for_event {
    my ( $self, $event_id ) = @_;

    return $self->search(
        {   event_id => $event_id,
            status   => { -in => [ 'pending', 'confirmed' ] },
        }
    )->count;
}

=head2 promote_waitlisted_for_event($event_id, $target_group_id)

Promote the oldest waitlisted attendee for the given event + target group
to C<confirmed>. Returns the promoted attendee, or undef if none was
waiting. The caller is responsible for triggering any notification.

=cut

sub promote_waitlisted_for_event {
    my ( $self, $event_id, $target_group_id ) = @_;

    my $candidate = $self->search(
        {   event_id        => $event_id,
            target_group_id => $target_group_id,
            status          => 'waitlisted',
        },
        { order_by => { -asc => 'created_at' }, rows => 1 },
    )->next;

    return if !$candidate;

    $candidate->transition_to('confirmed');
    return $candidate;
}

=head2 Internal methods

=head3 _type

=cut

sub _type {
    return 'KohaPluginComLmscloudEventmanagementEAttendee';
}

=head3 object_class

=cut

sub object_class {
    return 'Koha::LMSCloud::EventManagement::Attendee';
}

1;
