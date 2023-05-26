package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Settings;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';
use Try::Tiny;
use Readonly;
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

sub list {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $settings = _get_settings();

        return $c->render( status => 200, openapi => $settings );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub add {
    my $c        = shift->openapi->valid_input or return;
    my $settings = $c->req->json;

    return try {
        for my $setting ( $settings->@* ) {
            my $json_value = $json->encode( $setting->{'value'} );

            $self->store_data( { $setting->{'key'} => $json_value } );
        }

        $settings = _get_settings();

        return $c->render( status => 200, openapi => $settings );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub _get_settings {
    my $sql = SQL::Abstract->new;
    my $dbh = C4::Context->dbh;

    my ( $stmt, @bind ) = $sql->select( 'plugin_data', [ 'plugin_key', 'plugin_value' ], { 'plugin_class' => 'Koha::Plugin::Com::LMSCloud::EventManagement' } );
    my $sth = $dbh->prepare($stmt);
    $sth->execute(@bind);

    my $settings = $sth->fetchall_arrayref( {} );

    foreach my $setting ( $settings->@* ) {
        my $plugin_value         = $setting->{'plugin_value'};
        my $decoded_plugin_value = eval { $json->decode($plugin_value); } or do {
            next;
        };

        $setting->{'plugin_value'} = $decoded_plugin_value;
    }

    return $settings;
}

1;
