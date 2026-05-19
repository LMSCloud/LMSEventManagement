package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Attendee;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use Try::Tiny qw( catch try );

use Koha::LMSCloud::EventManagement::Attendees ();

our $VERSION = '1.0.0';

sub update {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $id   = $c->validation->param('id');
        my $body = $c->validation->param('body');

        my $attendee = Koha::LMSCloud::EventManagement::Attendees->new->find($id);
        if ( !$attendee ) {
            return $c->render( status => 404, openapi => { error => 'attendee not found' } );
        }

        if ( defined $body->{status} ) {
            $attendee->transition_to( $body->{status} );
        }

        $attendee->discard_changes;
        return $c->render( status => 200, openapi => $attendee->to_response );
    }
    catch {
        my $err = $_;
        if ( $err =~ /BOOKING_BAD_TRANSITION/ ) {
            return $c->render(
                status  => 409,
                openapi => { error => 'invalid status transition' }
            );
        }
        return $c->unhandled_exception($err);
    };
}

1;
