package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Locations;

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

sub list {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $locations_set = Koha::LMSCloud::EventManagement::Locations->new;
        my $locations     = $c->objects->search($locations_set);

        return $c->render( status => 200, openapi => $locations || [] );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub add {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $body = $c->validation->param('body');

        my $location = Koha::LMSCloud::EventManagement::Location->new_from_api($body)->store;

        return $c->render( status => 200, openapi => $location->unblessed || {} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
