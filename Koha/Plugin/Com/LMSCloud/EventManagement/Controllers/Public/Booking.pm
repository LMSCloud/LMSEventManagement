package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Public::Booking;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use Try::Tiny qw( catch try );

use Koha::LMSCloud::EventManagement::Booking  ();
use Koha::LMSCloud::EventManagement::Bookings ();

our $VERSION = '1.0.0';

sub confirm {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $token = $c->validation->param('token');
        if ( !$token ) {
            return $c->render( status => 400, openapi => { error => 'token required' } );
        }

        my $booking = Koha::LMSCloud::EventManagement::Bookings->new->find_by_token($token);
        if ( !$booking ) {
            return $c->render( status => 404, openapi => { error => 'token invalid' } );
        }

        $booking->confirm;

        return $c->render( status => 200, openapi => $booking->to_response );
    }
    catch {
        return _render_booking_error( $c, $_ );
    };
}

sub cancel {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $id    = $c->validation->param('id');
        my $body  = $c->validation->param('body') // {};
        my $token = $body->{token};

        my $booking = Koha::LMSCloud::EventManagement::Bookings->new->find($id);
        if ( !$booking ) {
            return $c->render( status => 404, openapi => { error => 'booking not found' } );
        }

        my $current_user = $c->stash('koha.user');
        my $authorized   = 0;
        if (   $current_user
            && $booking->booker_borrowernumber
            && $booking->booker_borrowernumber == $current_user->borrowernumber )
        {
            $authorized = 1;
        }
        elsif ( $token
            && $booking->confirmation_token
            && $booking->confirmation_token eq $token )
        {
            $authorized = 1;
        }

        if ( !$authorized ) {
            return $c->render(
                status  => 403,
                openapi => { error => 'not allowed to cancel this booking' }
            );
        }

        $booking->cancel;
        $booking->discard_changes;

        return $c->render( status => 200, openapi => $booking->to_response );
    }
    catch {
        return _render_booking_error( $c, $_ );
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
