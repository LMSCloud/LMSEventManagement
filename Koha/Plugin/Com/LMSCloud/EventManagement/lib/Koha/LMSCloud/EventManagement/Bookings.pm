package Koha::LMSCloud::EventManagement::Bookings;

use Modern::Perl;

use Carp qw( croak );

use Koha::Database ();

use Koha::LMSCloud::EventManagement::Attendee  ();
use Koha::LMSCloud::EventManagement::Attendees ();
use Koha::LMSCloud::EventManagement::Booking   ();

use base qw(Koha::Objects);

=head1 NAME

Koha::LMSCloud::EventManagement::Bookings - resultset for bookings

=head1 API

=head2 create_with_attendees($args)

Atomically create a booking and its attendees with capacity enforcement.

C<$args> is:

  {
      event_id  => 42,
      booker    => { borrowernumber => 17 }                 # patron
                 OR { name => 'Foo', email => 'foo@bar' },  # anonymous
      attendees => [
          { borrowernumber => 17,    name => 'Foo',  dob => '1990-01-01',
            target_group_id => 3 },
          { borrowernumber => undef, name => 'Lisa', dob => '2018-05-12',
            target_group_id => 5 },
          ...
      ],
  }

Server-side guarantees, all under one transaction with C<SELECT ... FOR
UPDATE> on the events row:

=over

=item *

Capacity is checked atomically. Attendees that fit go in as C<pending>;
overflow goes in as C<waitlisted>.

=item *

C<fee_at_booking> is snapshotted from C<event_target_group_fees> at
insert time. Caller cannot override.

=item *

Anonymous bookings (C<booker.borrowernumber> undef) are rejected if any
attendee has a non-zero fee.

=item *

A confirmation token is generated for every booking; the patron is sent
an email link to flip the status from C<pending> to C<confirmed>.

=back

Croaks with a C<BOOKING_*>-prefixed string on validation failure. The
caller (controller) is expected to translate these into HTTP error
responses.

=cut

sub create_with_attendees {
    my ( $self, $args ) = @_;

    my $event_id  = $args->{event_id}  or croak 'BOOKING_BAD_REQUEST: event_id required';
    my $booker    = $args->{booker}    or croak 'BOOKING_BAD_REQUEST: booker required';
    my $attendees = $args->{attendees} or croak 'BOOKING_BAD_REQUEST: attendees required';
    croak 'BOOKING_BAD_REQUEST: at least one attendee required' if !@{$attendees};

    my $schema = Koha::Database->new->schema;

    return $schema->txn_do(
        sub {

            # Lock the event row for the duration of the transaction. Without
            # this, two concurrent bookings can both see the same available
            # seat count and overcommit.
            my $event_row =
                $schema->resultset('KohaPluginComLmscloudEventmanagementEvent')
                ->search( { id => $event_id }, { for => 'update' } )->next;
            croak 'BOOKING_EVENT_NOT_FOUND' if !$event_row;

            my $max_participants = $event_row->max_participants;
            my $taken            = Koha::LMSCloud::EventManagement::Attendees->new->count_active_for_event($event_id);
            my $remaining        = defined $max_participants ? ( $max_participants - $taken ) : undef;

            # Snapshot fees inside the lock so a concurrent staff edit to the
            # fee table cannot change what a patron is billed mid-booking.
            my $fees_rs  = $schema->resultset('KohaPluginComLmscloudEventmanagementETgFee');
            my $prepared = [];
            for my $a ( @{$attendees} ) {
                my $tg_id = $a->{target_group_id}
                    or croak 'BOOKING_BAD_REQUEST: attendee missing target_group_id';

                my $fee_row = $fees_rs->search(
                    {   event_id        => $event_id,
                        target_group_id => $tg_id,
                    }
                )->first;
                croak "BOOKING_TARGET_GROUP_NOT_OFFERED: target group $tg_id not offered on event $event_id"
                    if !$fee_row;

                push @{$prepared}, { %{$a}, fee_at_booking => $fee_row->fee // 0 };
            }

            # Anonymous-must-be-free invariant
            my $is_anonymous = !defined $booker->{borrowernumber};
            if ($is_anonymous) {
                for my $a ( @{$prepared} ) {
                    if ( $a->{fee_at_booking} > 0 ) {
                        croak 'BOOKING_ANONYMOUS_PAID: anonymous bookings cannot include paid attendees';
                    }
                }
            }

            my $booking = Koha::LMSCloud::EventManagement::Booking->new(
                {   event_id              => $event_id,
                    booker_borrowernumber => $booker->{borrowernumber},
                    booker_name           => $booker->{name},
                    booker_email          => $booker->{email},
                    confirmation_token    => _generate_token(),
                }
            )->store;

            for my $a ( @{$prepared} ) {
                my $status;
                if ( defined $remaining && $remaining <= 0 ) {
                    $status = 'waitlisted';
                }
                else {
                    $status = 'pending';
                    $remaining-- if defined $remaining;
                }

                Koha::LMSCloud::EventManagement::Attendee->new(
                    {   booking_id              => $booking->id,
                        event_id                => $event_id,
                        attendee_borrowernumber => $a->{borrowernumber},
                        attendee_name           => $a->{name},
                        attendee_dob            => $a->{dob},
                        target_group_id         => $a->{target_group_id},
                        fee_at_booking          => $a->{fee_at_booking},
                        status                  => $status,
                    }
                )->store;
            }

            $booking->discard_changes;
            return $booking;
        }
    );
}

=head2 find_by_token($token)

Returns the booking carrying the given confirmation token, or undef.
Tokens are cleared on confirm, so a successful lookup implies the booking
has not been confirmed yet.

=cut

sub find_by_token {
    my ( $self, $token ) = @_;
    return if !defined $token || $token eq q{};
    return $self->search( { confirmation_token => $token } )->next;
}

sub _generate_token {

    # 192 bits from the kernel CSPRNG, hex-encoded. /dev/urandom is present
    # on every Linux/macOS host Koha runs on; no extra module dependency.
    open my $fh, '<:raw', '/dev/urandom'
        or croak "BOOKING_TOKEN_FAIL: cannot open /dev/urandom: $!";
    read $fh, my $bytes, 24;
    close $fh;
    return unpack 'H*', $bytes;
}

=head2 Internal methods

=head3 _type

=cut

sub _type {
    return 'KohaPluginComLmscloudEventmanagementEBooking';
}

=head3 object_class

=cut

sub object_class {
    return 'Koha::LMSCloud::EventManagement::Booking';
}

1;
