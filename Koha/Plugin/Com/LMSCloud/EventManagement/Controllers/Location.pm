package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Location;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';
use Try::Tiny;
use Locale::TextDomain ( 'com.lmscloud.eventmanagement', undef );
use Locale::Messages qw(:locale_h :libintl_h bind_textdomain_filter);
use POSIX qw(setlocale);
use Encode;

use Koha::Plugin::Com::LMSCloud::EventManagement;
use Koha::LMSCloud::EventManagement::Location;
use Koha::LMSCloud::EventManagement::Locations;

our $VERSION = '1.0.0';

my $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;

setlocale Locale::Messages::LC_MESSAGES(), q{};
textdomain 'com.lmscloud.eventmanagement';
bind_textdomain_filter 'com.lmscloud.eventmanagement', \&Encode::decode_utf8;
bindtextdomain 'com.lmscloud.eventmanagement' => $self->bundle_path . '/locales/';

sub get {
    my $c = shift->openapi->valid_input or return;

    return try {
        local $ENV{LANGUAGE}       = $c->validation->param('lang') || 'en';
        local $ENV{OUTPUT_CHARSET} = 'UTF-8';
        my $id       = $c->validation->param('id');
        my $location = Koha::LMSCloud::EventManagement::Locations->find($id);

        if ( !$location ) {
            return $c->render( status => 404, openapi => { error => __('Location not found') } );
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
        local $ENV{LANGUAGE}       = $c->validation->param('lang') || 'en';
        local $ENV{OUTPUT_CHARSET} = 'UTF-8';
        my $id       = $c->validation->param('id');
        my $body     = $c->validation->param('body');
        my $location = Koha::LMSCloud::EventManagement::Locations->find($id);

        if ( !$location ) {
            return $c->render( status => 404, openapi => { error => __('Location not found') } );
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
        local $ENV{LANGUAGE}       = $c->validation->param('lang') || 'en';
        local $ENV{OUTPUT_CHARSET} = 'UTF-8';
        my $id = $c->validation->param('id');

        # This is a temporary fix for the issue with the delete method on rvs of find calls
        my $location = Koha::LMSCloud::EventManagement::Locations->search( { id => $id } );

        if ( !$location ) {
            return $c->render( status => 404, openapi => { error => __('Location not found') } );
        }

        $location->delete;

        return $c->render( status => 204, openapi => q{} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
