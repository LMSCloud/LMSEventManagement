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

C<install_letters> seeds default English content into Koha's C<letter>
table on plugin install or upgrade; templates already present are left
alone so library customisations survive. Sends are wrapped in eval, so a
broken template or transport never aborts a booking-lifecycle operation.

=head1 API

=cut

my $MODULE_CODE = 'lms_event_management';

my $DEFAULT_LETTERS = [
    {   code  => 'EVENT_BOOKING_CONFIRM',
        title => 'Please confirm your event registration',
        body  => <<'BODY',
Hello [% IF borrower.firstname %][% borrower.firstname %][% ELSE %][% booker_name %][% END %],

Thank you for registering for [% event.name %].

To confirm your registration please use the following token at your
library's event-confirmation page:

    [% confirmation_token %]

If your library has provided a confirmation link it should look like:

    [% confirm_url %]

If you did not request this registration you can safely ignore this email.

-- Library Events
BODY
    },
    {   code  => 'EVENT_WAITLIST_PROMOTED',
        title => 'A seat is now available for the event you joined',
        body  => <<'BODY',
Hello [% IF borrower.firstname %][% borrower.firstname %][% ELSE %][% attendee.attendee_name %][% END %],

Good news: a seat has opened up for [% event.name %] and you have been
moved from the waitlist into the confirmed attendees list.

If you can no longer attend please cancel your registration so the seat
can be offered to the next waitlisted person.

-- Library Events
BODY
    },
    {   code  => 'EVENT_BOOKING_CANCELED',
        title => 'Your event registration has been canceled',
        body  => <<'BODY',
Hello [% IF borrower.firstname %][% borrower.firstname %][% ELSE %][% booker_name %][% END %],

Your registration for [% event.name %] has been canceled.

If this was not expected please contact the library.

-- Library Events
BODY
    },
];

=head2 install_letters

Insert the three default templates into the C<letter> table for each
existing C<lang> setting, only when no row already exists for that
C<(module, code, branchcode, lang)> combination. Safe to call repeatedly.

=cut

sub install_letters {
    my ($class) = @_;

    my $dbh = C4::Context->dbh;

    my $find = $dbh->prepare(<<'SQL');
        SELECT 1 FROM letter
         WHERE module = ?
           AND code   = ?
           AND ( branchcode IS NULL OR branchcode = '' )
           AND lang   = 'default'
SQL

    my $insert = $dbh->prepare(<<'SQL');
        INSERT INTO letter ( module, code, branchcode, name, title, content, message_transport_type, is_html, lang )
        VALUES             ( ?,      ?,    '',          ?,    ?,     ?,       'email',                0,       'default' )
SQL

    for my $tmpl ( @{$DEFAULT_LETTERS} ) {
        $find->execute( $MODULE_CODE, $tmpl->{code} );
        my ($exists) = $find->fetchrow_array;
        next if $exists;

        $insert->execute(
            $MODULE_CODE, $tmpl->{code}, $tmpl->{title}, $tmpl->{title}, $tmpl->{body},
        );
    }

    return 1;
}

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
    return if !$letter;

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
