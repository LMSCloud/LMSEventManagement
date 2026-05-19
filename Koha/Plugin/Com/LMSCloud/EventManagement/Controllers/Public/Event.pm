package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Public::Event;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use Try::Tiny qw( catch try );

use Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees ();
use Koha::LMSCloud::EventManagement::Events                   ();

use Koha::Plugin::Com::LMSCloud::EventManagement ();

our $VERSION = '1.0.0';

sub get {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $id    = $c->validation->param('id');
        my $event = Koha::LMSCloud::EventManagement::Events->find($id);

        if ( !$event ) {
            return $c->render( status => 404, openapi => { error => 'Event not found' } );
        }

        my $plugin       = Koha::Plugin::Com::LMSCloud::EventManagement->new;
        my $hide_pending = $plugin->retrieve_data('opac_hide_pending_events');
        if ( $hide_pending && $hide_pending eq '1' && $event->status eq 'pending' ) {
            return $c->render( status => 404, openapi => { error => 'Event not found' } );
        }

        my $unblessed = $event->unblessed;
        _interlace_target_groups($unblessed);

        return $c->render( status => 200, openapi => $unblessed );
    }
    catch {
        $c->unhandled_exception($_);
    };
}

sub _interlace_target_groups {
    my ($event) = @_;

    my $fees_set      = Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees->new;
    my $target_groups = $fees_set->search( { event_id => $event->{id} } );
    $event->{target_groups} = $target_groups->as_list;

    return;
}

1;
