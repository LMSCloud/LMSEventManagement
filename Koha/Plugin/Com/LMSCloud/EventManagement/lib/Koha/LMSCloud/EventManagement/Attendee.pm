package Koha::LMSCloud::EventManagement::Attendee;

use Modern::Perl;

use Carp qw( croak );

use base qw(Koha::Object);

use Koha::Database  ();
use Koha::DateUtils qw( dt_from_string );

=head1 NAME

Koha::LMSCloud::EventManagement::Attendee - one seat on an event

=head1 STATE MACHINE

Valid transitions, enforced by L</transition_to>:

  pending     -> confirmed | canceled
  confirmed   -> canceled | attended | no_show | waitlisted
  waitlisted  -> confirmed | canceled
  canceled    -> (terminal)
  attended    -> (terminal)
  no_show     -> (terminal)

=head1 API

=head2 transition_to($new_status)

Move the attendee into C<$new_status>. Croaks with C<BOOKING_BAD_TRANSITION>
if the move is not allowed from the current state. Sets C<attended_at> /
C<canceled_at> when applicable.

=cut

my $VALID_TRANSITIONS = {
    pending    => { confirmed => 1, canceled => 1 },
    confirmed  => { canceled  => 1, attended => 1, no_show => 1, waitlisted => 1 },
    waitlisted => { confirmed => 1, canceled => 1 },
    canceled   => {},
    attended   => {},
    no_show    => {},
};

sub transition_to {
    my ( $self, $new_status ) = @_;

    my $current = $self->status;

    if ( !exists $VALID_TRANSITIONS->{$current}{$new_status} ) {
        croak "BOOKING_BAD_TRANSITION: $current -> $new_status";
    }

    my $schema = Koha::Database->new->schema;
    my $dtf    = $schema->storage->datetime_parser;
    my $now    = $dtf->format_datetime( dt_from_string() );

    $self->status($new_status);
    if ( $new_status eq 'attended' ) {
        $self->attended_at($now);
    }
    if ( $new_status eq 'canceled' ) {
        $self->canceled_at($now);
    }

    return $self->store;
}

=head2 Internal methods

=head3 _type

=cut

sub _type {
    return 'KohaPluginComLmscloudEventmanagementEAttendee';
}

1;
