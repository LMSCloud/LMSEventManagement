package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Attendees;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use Try::Tiny qw( catch try );

use Koha::LMSCloud::EventManagement::Attendees ();
use Koha::LMSCloud::EventManagement::Events    ();

our $VERSION = '1.0.0';

sub list {
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
            my $statuses = [ grep {defined} @{$status_param} ];
            if ( @{$statuses} ) {
                $search_params->{status} = { -in => $statuses };
            }
        }

        my $rs = Koha::LMSCloud::EventManagement::Attendees->new->search( $search_params, { order_by => { -asc => 'created_at' } }, );

        my $out = [];
        while ( my $attendee = $rs->next ) {
            push @{$out}, $attendee->to_response;
        }

        return $c->render( status => 200, openapi => $out );
    }
    catch {
        $c->unhandled_exception($_);
    };
}

1;
