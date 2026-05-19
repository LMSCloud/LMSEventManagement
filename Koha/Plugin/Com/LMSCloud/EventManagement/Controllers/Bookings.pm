package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Bookings;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use Try::Tiny qw( catch try );

use Koha::LMSCloud::EventManagement::Attendee  ();
use Koha::LMSCloud::EventManagement::Attendees ();
use Koha::LMSCloud::EventManagement::Bookings  ();
use Koha::LMSCloud::EventManagement::Events    ();

our $VERSION = '1.0.0';

sub list_attendees {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $event_id     = $c->validation->param('event_id');
        my $status_param = $c->validation->every_param('status');

        my $event = Koha::LMSCloud::EventManagement::Events->find($event_id);
        if ( !$event ) {
            return $c->render( status => 404, openapi => { error => 'event not found' } );
        }

        my $search_params = { event_id => $event_id };
        if ( $status_param && @{$status_param} ) {
            my $statuses = [ grep { defined } @{$status_param} ];
            if ( @{$statuses} ) {
                $search_params->{status} = { -in => $statuses };
            }
        }

        my $rs = Koha::LMSCloud::EventManagement::Attendees->new->search(
            $search_params,
            { order_by => { -asc => 'created_at' } },
        );

        my $out = [];
        while ( my $attendee = $rs->next ) {
            push @{$out}, _attendee_to_api($attendee);
        }

        return $c->render( status => 200, openapi => $out );
    }
    catch {
        $c->unhandled_exception($_);
    };
}

sub update_attendee {
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
        return $c->render( status => 200, openapi => _attendee_to_api($attendee) );
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

sub _attendee_to_api {
    my ($attendee) = @_;
    my $hash = $attendee->unblessed;
    delete $hash->{active_borrower_key};
    return $hash;
}

1;
