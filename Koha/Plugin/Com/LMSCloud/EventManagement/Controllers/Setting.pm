package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Setting;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';
use Try::Tiny;
use Readonly;
use English qw( -no_match_vars );
use Locale::TextDomain ( 'com.lmscloud.eventmanagement', undef );
use Locale::Messages qw(:locale_h :libintl_h bind_textdomain_filter);
use POSIX qw(setlocale);
use Encode;

use SQL::Abstract;
use JSON::MaybeXS;
use Koha::Plugin::Com::LMSCloud::EventManagement;
use Koha::Plugin::Com::LMSCloud::EventManagement::lib::Validator;
use C4::Context;

our $VERSION = '1.0.0';

my $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;

setlocale Locale::Messages::LC_MESSAGES(), q{};
textdomain 'com.lmscloud.eventmanagement';
bind_textdomain_filter 'com.lmscloud.eventmanagement', \&Encode::decode_utf8;
bindtextdomain 'com.lmscloud.eventmanagement' => $self->bundle_path . '/locales/';

my $json = JSON::MaybeXS->new->utf8;

sub get {
    my $c          = shift->openapi->valid_input or return;
    my $plugin_key = $c->validation->param('key');

    return try {
        my $setting = _get_setting($plugin_key);

        if ( !( defined $setting ) ) {
            return $c->render( status => 404, openapi => { 'error' => __('Setting not found') } );
        }

        return $c->render( status => 200, openapi => $setting );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub update {
    my $c          = shift->openapi->valid_input or return;
    my $plugin_key = $c->validation->param('key');
    my $setting    = $c->req->json;

    return try {
        my $previous_setting = _get_setting($plugin_key);

        if ( !( defined $previous_setting ) ) {
            return $c->render( status => 404, openapi => { 'error' => __('Setting not found') } );
        }

        my $json_value = $json->encode( $setting->{'value'} );

        $self->store_data( { 'key' => $json_value } );

        $setting = _get_setting( $setting->{'key'} );

        return $c->render( status => 200, openapi => $setting );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub _get_setting {
    my $plugin_key = shift;

    my $plugin_value = $self->retrieve_data($plugin_key);

    my $json_value;
    eval { $json_value = $json->decode($plugin_value); } or do {

        # Parsing failed, return the original value
        return $plugin_value;
    };

    return $json_value;
}

1;
