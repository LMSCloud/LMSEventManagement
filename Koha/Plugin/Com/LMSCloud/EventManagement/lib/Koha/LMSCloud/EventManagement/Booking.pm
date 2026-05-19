package Koha::LMSCloud::EventManagement::Booking;

use Modern::Perl;

use Carp qw( croak );

use base qw(Koha::Object);

use Koha::Database                              ();
use Koha::DateUtils                             qw( dt_from_string );
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

Mark the booking as confirmed: clear the token, set confirmed_at, and flip
every pending attendee to confirmed. Waitlisted attendees stay waitlisted.
Idempotent: a second call is a no-op.

Croaks with C<BOOKING_TOKEN_INVALID> if the booking is already confirmed
and no further work is needed.

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
            $self->confirmation_token(undef);
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

Cancel the booking and every active attendee on it. Waitlist promotion is
the caller's responsibility (see Attendees->promote_waitlisted_for_event).

=cut

sub cancel {
    my ($self) = @_;

    my $schema = Koha::Database->new->schema;

    return $schema->txn_do(
        sub {
            my $active = $self->attendees->search( { status => { -in => [ 'pending', 'confirmed', 'waitlisted' ] } } );
            while ( my $attendee = $active->next ) {
                $attendee->transition_to('canceled');
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
