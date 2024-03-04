package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Location;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use Try::Tiny qw( catch try );

use Locale::Messages qw(
    bind_textdomain_filter
    bindtextdomain
    setlocale
    textdomain
);
use Locale::TextDomain ( 'com.lmscloud.eventmanagement', undef );

use Koha::LMSCloud::EventManagement::Location  ();
use Koha::LMSCloud::EventManagement::Locations ();
use Koha::Plugin::Com::LMSCloud::Validator     ();

our $VERSION = '1.0.0';

my $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;

setlocale Locale::Messages::LC_MESSAGES(), q{};
textdomain 'com.lmscloud.eventmanagement';
bind_textdomain_filter 'com.lmscloud.eventmanagement', \&Encode::decode_utf8;
bindtextdomain 'com.lmscloud.eventmanagement' => $self->bundle_path . '/locales/';

sub _validate {
    my ($args) = @_;

    my $validator = Koha::Plugin::Com::LMSCloud::Validator->new( { schema => $args->{'schema'}, lang => $args->{'lang'} } );
    return $validator->validate();
}

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
        my $lang = $c->validation->param('lang') || 'en';
        local $ENV{LANGUAGE}       = $lang;
        local $ENV{OUTPUT_CHARSET} = 'UTF-8';
        my $id       = $c->validation->param('id');
        my $body     = $c->validation->param('body');
        my $location = Koha::LMSCloud::EventManagement::Locations->find($id);

        if ( !$location ) {
            return $c->render( status => 404, openapi => { error => __('Location not found') } );
        }

        my ( $is_valid, $errors ) = _validate(
            {   schema => [
                    {   key     => __('name'),
                        value   => $body->{'name'},
                        type    => 'string',
                        options => { is_alphanumeric => { skip => 1, } },
                    },
                    {   key     => __('street'),
                        value   => $body->{'street'},
                        type    => 'string',
                        options => { is_alphanumeric => { skip => 1, } },

                    },
                    {   key     => __('number'),
                        value   => $body->{'number'},
                        type    => 'string',
                        options => { is_alphanumeric => { skip => 1, } },

                    },
                    {   key     => __('city'),
                        value   => $body->{'city'},
                        type    => 'string',
                        options => { is_alphanumeric => { skip => 1, } },

                    },
                    {   key     => __('zip'),
                        value   => $body->{'zip'},
                        type    => 'string',
                        options => { is_alphanumeric => { skip => 1, } },

                    },
                    {   key     => __('country'),
                        value   => $body->{'country'},
                        type    => 'string',
                        options => { is_alphanumeric => { skip => 1, } },

                    },
                ],
                lang => $lang
            }
        );

        if ( !$is_valid ) {
            return $c->render( status => 400, openapi => { error => $errors } );
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
