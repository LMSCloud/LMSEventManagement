package Koha::Plugin::Com::LMSCloud::EventManagement::Adapters::Notifier;

use Modern::Perl;
use utf8;

use Carp      qw( carp );
use Try::Tiny qw( catch try );

use C4::Context    ();
use C4::Letters    ();
use Koha::Database ();
use Koha::Patrons  ();

use Koha::LMSCloud::EventManagement::Bookings ();
use Koha::LMSCloud::EventManagement::Events   ();

=head1 NAME

Koha::Plugin::Com::LMSCloud::EventManagement::Adapters::Notifier - email
delivery for booking lifecycle events

=head1 DESCRIPTION

Wraps C<C4::Letters> for the three booking-flow letter codes:

=over

=item EVENT_BOOKING_CONFIRM

Sent right after the booking row is created. Carries the management token
and (when L</_confirm_url> can compute one) a clickable link.

=item EVENT_WAITLIST_PROMOTED

Sent when a previously waitlisted attendee gets promoted to confirmed via
auto-promotion or staff action.

=item EVENT_BOOKING_CANCELED

Sent when a booking is canceled, whether by the patron, by staff, or by
the nightly TTL sweep.

=back

Letter templates are B<not> installed by the plugin; the library
administrator is expected to add them via Tools → Notices & slips with
module C<lms_event_management> and the codes above. This matches the
LMSRoomReservations approach and gives staff full control over wording,
language variants, transports, and HTML toggling without an upgrade ever
overwriting their edits. When a template is missing the send is skipped
with a single C<carp> so the booking still goes through.

=head1 API

=cut

my $MODULE_CODE = 'lms_event_management';

=head2 send_booking_confirmation($booking)

Best-effort send of the confirmation email after a booking is created.
Picks the recipient from C<booker_borrowernumber> (patron path) or
C<booker_email> (anonymous path) and lets C<C4::Letters> handle the rest.

=cut

sub send_booking_confirmation {
    my ( $class, $booking ) = @_;

    return try {
        my $event = _event_for($booking);
        return if !$event;

        my $confirm_url = _confirm_url( $booking->confirmation_token );

        my $substitute = {
            confirmation_token => $booking->confirmation_token,
            confirm_url        => $confirm_url,
            booker_name        => $booking->booker_name,
        };

        _send(
            {   booking   => $booking,
                event     => $event,
                code      => 'EVENT_BOOKING_CONFIRM',
                substitute => $substitute,
            }
        );
    }
    catch {
        carp "EVENT_BOOKING_CONFIRM send failed: $_";
    };
}

=head2 send_waitlist_promotion($attendee)

Best-effort send when a waitlisted attendee is promoted. Recipient is
the parent booking's booker.

=cut

sub send_waitlist_promotion {
    my ( $class, $attendee ) = @_;

    return try {
        my $booking = Koha::LMSCloud::EventManagement::Bookings->new->find( $attendee->booking_id );
        return if !$booking;

        my $event = _event_for($booking);
        return if !$event;

        _send(
            {   booking    => $booking,
                event      => $event,
                code       => 'EVENT_WAITLIST_PROMOTED',
                substitute => {
                    attendee    => { %{ $attendee->unblessed } },
                    booker_name => $booking->booker_name,
                },
            }
        );
    }
    catch {
        carp "EVENT_WAITLIST_PROMOTED send failed: $_";
    };
}

=head2 send_booking_canceled($booking)

Best-effort send when a booking is canceled (by patron, staff, or the
TTL sweep).

=cut

sub send_booking_canceled {
    my ( $class, $booking ) = @_;

    return try {
        my $event = _event_for($booking);
        return if !$event;

        _send(
            {   booking    => $booking,
                event      => $event,
                code       => 'EVENT_BOOKING_CANCELED',
                substitute => { booker_name => $booking->booker_name },
            }
        );
    }
    catch {
        carp "EVENT_BOOKING_CANCELED send failed: $_";
    };
}

sub _send {
    my ($args) = @_;
    my $booking    = $args->{booking};
    my $event      = $args->{event};
    my $code       = $args->{code};
    my $substitute = $args->{substitute} // {};

    $substitute->{event}   //= { %{ $event->unblessed } };
    $substitute->{booking} //= { %{ $booking->unblessed } };

    my $borrowernumber = $booking->booker_borrowernumber;
    my $to_address     = $borrowernumber ? undef : $booking->booker_email;

    my $tables = {};
    if ($borrowernumber) {
        $tables->{borrowers} = $borrowernumber;
    }

    my $letter = C4::Letters::GetPreparedLetter(
        module      => $MODULE_CODE,
        letter_code => $code,
        branchcode  => q{},
        tables      => $tables,
        substitute  => $substitute,
    );
    if ( !$letter ) {
        carp "$MODULE_CODE letter '$code' is not installed; skipping notification";
        return;
    }

    C4::Letters::EnqueueLetter(
        {   letter                 => $letter,
            borrowernumber         => $borrowernumber,
            message_transport_type => 'email',
            to_address             => $to_address,
        }
    );

    return 1;
}

sub _event_for {
    my ($booking) = @_;
    return Koha::LMSCloud::EventManagement::Events->find( $booking->event_id );
}

sub _confirm_url {
    my ($token) = @_;
    return q{} if !$token;

    my $opac_base = C4::Context->preference('OPACBaseURL') // q{};
    $opac_base =~ s{/$}{};
    return q{} if !$opac_base;

    return $opac_base . '/cgi-bin/koha/pages.pl?p=lmscloud-eventmanagement&confirm=' . $token;
}

1;
