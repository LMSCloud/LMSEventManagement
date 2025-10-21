package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::TargetGroup;


use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use Readonly  ();
use Try::Tiny qw( catch try );

use Locale::Messages qw(
    bind_textdomain_filter
    bindtextdomain
    setlocale
    textdomain
);
use Locale::TextDomain ( 'com.lmscloud.eventmanagement', undef );

use Koha::LMSCloud::EventManagement::TargetGroup  ();
use Koha::LMSCloud::EventManagement::TargetGroups ();
use Koha::Plugin::Com::LMSCloud::Validator        ();

our $VERSION = '1.0.0';

my $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;

setlocale Locale::Messages::LC_MESSAGES(), q{};
textdomain 'com.lmscloud.eventmanagement';
bind_textdomain_filter 'com.lmscloud.eventmanagement', \&Encode::decode_utf8;
bindtextdomain 'com.lmscloud.eventmanagement' => $self->bundle_path . '/locales/';

Readonly::Scalar my $UPPER_AGE_BOUNDARY => 255;

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
        my $id           = $c->validation->param('id');
        my $target_group = Koha::LMSCloud::EventManagement::TargetGroups->find($id);

        if ( !$target_group ) {
            return $c->render( status => 404, openapi => { error => __('Target Group not found') } );
        }

        return $c->render(
            status  => 200,
            openapi => $target_group->unblessed
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
        my $id           = $c->validation->param('id');
        my $body         = $c->validation->param('body');
        my $target_group = Koha::LMSCloud::EventManagement::TargetGroups->find($id);

        if ( !$target_group ) {
            return $c->render( status => 404, openapi => { error => __('Target Group not found') } );
        }

        my ( $is_valid, $errors ) = _validate(
            {   schema => [
                    {   key     => __('name'),
                        value   => $body->{'name'},
                        type    => 'string',
                        options => { is_alphanumeric => { skip => 1, } },
                    },
                    {   key     => __('min_age'),
                        value   => $body->{'min_age'},
                        type    => 'number',
                        options => {
                            positive => 1,
                            range    => [ 0, $UPPER_AGE_BOUNDARY ],
                        }
                    },
                    {   key     => __('max_age'),
                        value   => $body->{'max_age'},
                        type    => 'number',
                        options => {
                            positive => 1,
                            range    => [ 0, $UPPER_AGE_BOUNDARY ],
                        }
                    },
                ],
                lang => $lang
            }
        );

        if ( !$is_valid ) {
            return $c->render( status => 400, openapi => { error => $errors } );
        }

        $target_group->set_from_api($body);
        $target_group->store;

        return $c->render(
            status  => 200,
            openapi => $target_group->unblessed
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
        my $target_group = Koha::LMSCloud::EventManagement::TargetGroups->search( { id => $id } );

        if ( !$target_group ) {
            return $c->render( status => 404, openapi => { error => __('Target Group not found') } );
        }

        $target_group->delete;

        return $c->render( status => 204, openapi => q{} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
