package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Public::Bookings;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use Readonly  ();
use Try::Tiny qw( catch try );

use Koha::LMSCloud::EventManagement::Booking  ();
use Koha::LMSCloud::EventManagement::Bookings ();
use Koha::LMSCloud::EventManagement::Events   ();

use Koha::Plugin::Com::LMSCloud::EventManagement::Adapters::HouseholdRoster ();

our $VERSION = '1.0.0';

# Anti-grief cap on attendees per booking. The unique-per-borrower
# constraint already bounds patron attendees; this is the bound on
# ad-hoc kids one booker can claim in a single submission.
Readonly::Scalar my $MAX_ATTENDEES_PER_BOOKING => 10;

sub add {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $body = $c->validation->param('body');

        my $event_id  = $body->{event_id};
        my $attendees = $body->{attendees} // [];

        if ( !$event_id ) {
            return $c->render(
                status  => 400,
                openapi => { error => 'event_id required' }
            );
        }
        if ( !@{$attendees} ) {
            return $c->render(
                status  => 400,
                openapi => { error => 'at least one attendee required' }
            );
        }
        if ( @{$attendees} > $MAX_ATTENDEES_PER_BOOKING ) {
            return $c->render(
                status  => 400,
                openapi => { error => "at most $MAX_ATTENDEES_PER_BOOKING attendees per booking" }
            );
        }

        my $event = Koha::LMSCloud::EventManagement::Events->find($event_id);
        if ( !$event ) {
            return $c->render( status => 404, openapi => { error => 'event not found' } );
        }
        if ( $event->status eq 'canceled' ) {
            return $c->render( status => 409, openapi => { error => 'event has been canceled' } );
        }

        my $current_user = $c->stash('koha.user');
        my $booker;
        if ( $current_user && $current_user->borrowernumber ) {
            $booker = {
                borrowernumber => $current_user->borrowernumber,
                name           => undef,
                email          => undef,
            };
        }
        else {
            my $name  = $body->{booker}{name};
            my $email = $body->{booker}{email};
            if ( !$name || !$email ) {
                return $c->render(
                    status  => 400,
                    openapi => { error => 'booker.name and booker.email required for anonymous booking' }
                );
            }
            if ( !$event->open_registration ) {
                return $c->render(
                    status  => 403,
                    openapi => { error => 'event does not accept anonymous bookings' }
                );
            }
            $booker = { borrowernumber => undef, name => $name, email => $email };
        }

        my $booking = Koha::LMSCloud::EventManagement::Bookings->new->create_with_attendees(
            {   event_id  => $event_id,
                booker    => $booker,
                attendees => $attendees,
            }
        );

        return $c->render( status => 201, openapi => $booking->to_response );
    }
    catch {
        return _render_booking_error( $c, $_ );
    };
}

sub list {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $current_user = $c->stash('koha.user');
        if ( !$current_user || !$current_user->borrowernumber ) {
            return $c->render(
                status  => 401,
                openapi => { error => 'authentication required' }
            );
        }

        my $bookings =
            Koha::LMSCloud::EventManagement::Bookings->new->search( { booker_borrowernumber => $current_user->borrowernumber }, { order_by => { -desc => 'created_at' } }, );

        my $out = [];
        while ( my $b = $bookings->next ) {
            push @{$out}, $b->to_response;
        }

        return $c->render( status => 200, openapi => $out );
    }
    catch {
        return _render_booking_error( $c, $_ );
    };
}

sub household {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $current_user = $c->stash('koha.user');
        if ( !$current_user || !$current_user->borrowernumber ) {
            return $c->render(
                status  => 401,
                openapi => { error => 'authentication required' }
            );
        }

        my $event_id = $c->validation->param('event_id');
        if ( !$event_id ) {
            return $c->render( status => 400, openapi => { error => 'event_id required' } );
        }

        my $event = Koha::LMSCloud::EventManagement::Events->find($event_id);
        if ( !$event ) {
            return $c->render( status => 404, openapi => { error => 'event not found' } );
        }

        my $roster = Koha::Plugin::Com::LMSCloud::EventManagement::Adapters::HouseholdRoster->for_patron(
            {   borrowernumber => $current_user->borrowernumber,
                event_id       => $event_id,
            }
        );

        return $c->render( status => 200, openapi => $roster );
    }
    catch {
        $c->unhandled_exception($_);
    };
}

sub _render_booking_error {
    my ( $c, $err ) = @_;

    if ( $err =~ /BOOKING_EVENT_NOT_FOUND/ ) {
        return $c->render( status => 404, openapi => { error => 'event not found' } );
    }
    if ( $err =~ /BOOKING_ANONYMOUS_PAID/ ) {
        return $c->render( status => 403, openapi => { error => 'anonymous bookings cannot include paid attendees' } );
    }
    if ( $err =~ /BOOKING_TARGET_GROUP_NOT_OFFERED/ ) {
        return $c->render( status => 422, openapi => { error => 'one or more attendees use a target group not offered on this event' } );
    }
    if ( $err =~ /BOOKING_BAD_TRANSITION/ ) {
        return $c->render( status => 409, openapi => { error => 'invalid booking state transition' } );
    }
    if ( $err =~ /BOOKING_BAD_REQUEST: (.+?)(?:$| at )/ ) {
        return $c->render( status => 400, openapi => { error => $1 } );
    }

    return $c->unhandled_exception($err);
}

1;
