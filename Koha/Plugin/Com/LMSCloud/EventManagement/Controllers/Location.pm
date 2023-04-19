package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Location;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';
use Try::Tiny;

use Koha::Plugin::Com::LMSCloud::EventManagement;
use Koha::LMSCloud::EventManagement::Location;
use Koha::LMSCloud::EventManagement::Locations;

our $VERSION = '1.0.0';

my $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;

sub get {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $id       = $c->validation->param('id');
        my $location = Koha::LMSCloud::EventManagement::Locations->find($id);

        if ( !$location ) {
            return $c->render( status => 404, openapi => { error => 'Location not found' } );
        }

        return $c->render(
            status  => 200,
            openapi => $location->unblessed
        );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub update {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $id       = $c->validation->param('id');
        my $body     = $c->validation->param('body');
        my $location = Koha::LMSCloud::EventManagement::Locations->find($id);

        if ( !$location ) {
            return $c->render( status => 404, openapi => { error => 'Event not found' } );
        }

        $location->set_from_api($body);
        $location->store;

        return $c->render(
            status  => 200,
            openapi => $location->unblessed
        );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub delete {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $id = $c->validation->param('id');

        # This is a temporary fix for the issue with the delete method on rvs of find calls
        my $location = Koha::LMSCloud::EventManagement::Locations->search( { id => $id } );

        if ( !$location ) {
            return $c->render( status => 404, openapi => { error => 'Event not found' } );
        }

        $location->delete;

        return $c->render( status => 204, openapi => q{} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
