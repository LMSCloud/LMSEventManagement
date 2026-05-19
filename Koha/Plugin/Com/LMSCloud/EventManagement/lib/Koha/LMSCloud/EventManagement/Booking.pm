package Koha::LMSCloud::EventManagement::Booking;

use Modern::Perl;

use Carp qw( croak );

use base qw(Koha::Object);

use Koha::Database                             ();
use Koha::DateUtils                            qw( dt_from_string );
use Koha::LMSCloud::EventManagement::Attendees ();

=head1 NAME

Koha::LMSCloud::EventManagement::Booking - single booking transaction

A booking row carries the booker identity (Koha patron or anonymous
name+email) and a confirmation token. The actual seats live in
event_attendees, one row per attendee.

=head1 API

=head2 attendees

Returns the L<Koha::LMSCloud::EventManagement::Attendees> resultset for this
booking.

=cut

sub attendees {
    my ($self) = @_;

    return Koha::LMSCloud::EventManagement::Attendees->search( { booking_id => $self->id } );
}

=head2 is_anonymous

True if no Koha patron is attached to this booking.

=cut

sub is_anonymous {
    my ($self) = @_;
    return !defined $self->booker_borrowernumber;
}

=head2 confirm

Mark the booking as confirmed (set confirmed_at) and flip every pending
attendee to confirmed. Waitlisted attendees stay waitlisted. Idempotent:
a second call short-circuits when confirmed_at is already set.

The confirmation token is intentionally B<not> cleared. It doubles as a
management token for anonymous cancellation; the API never exposes it,
the email is the only delivery channel.

=cut

sub confirm {
    my ($self) = @_;

    my $schema = Koha::Database->new->schema;

    return $schema->txn_do(
        sub {
            if ( defined $self->confirmed_at ) {
                return $self;
            }

            my $dtf = $schema->storage->datetime_parser;
            my $now = $dtf->format_datetime( dt_from_string() );

            $self->confirmed_at($now);
            $self->store;

            my $pending = $self->attendees->search( { status => 'pending' } );
            while ( my $attendee = $pending->next ) {
                $attendee->transition_to('confirmed');
            }

            return $self;
        }
    );
}

=head2 cancel

Cancel the booking and every active attendee on it. For each attendee that
was consuming capacity (pending or confirmed), promote one waitlisted
attendee in the same target group to keep the event filled.

=cut

sub cancel {
    my ($self) = @_;

    my $schema = Koha::Database->new->schema;

    return $schema->txn_do(
        sub {
            # Koha::Objects guards ->all behind its method-coverage allowlist;
            # ->as_list is the always-permitted equivalent.
            my $active = [ $self->attendees->search( { status => { -in => [ 'pending', 'confirmed', 'waitlisted' ] } } )->as_list ];

            my $freed_target_groups = [];
            for my $attendee ( @{$active} ) {
                my $was_consuming = $attendee->status eq 'pending' || $attendee->status eq 'confirmed';
                $attendee->transition_to('canceled');
                push @{$freed_target_groups}, $attendee->target_group_id if $was_consuming;
            }

            my $attendees_set = Koha::LMSCloud::EventManagement::Attendees->new;
            for my $tg ( @{$freed_target_groups} ) {
                $attendees_set->promote_waitlisted_for_event( $self->event_id, $tg );
            }

            return $self;
        }
    );
}

=head2 Internal methods

=head3 _type

=cut

sub _type {
    return 'KohaPluginComLmscloudEventmanagementEBooking';
}

1;
