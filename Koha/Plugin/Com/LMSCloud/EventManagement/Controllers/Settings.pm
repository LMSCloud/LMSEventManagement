package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Settings;


use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use C4::Context ();

use JSON::MaybeXS ();
use SQL::Abstract ();
use Try::Tiny     qw( catch try );

use Locale::Messages qw(
    bind_textdomain_filter
    bindtextdomain
    setlocale
    textdomain
);
use Locale::TextDomain ( 'com.lmscloud.eventmanagement', undef );

our $VERSION = '1.0.0';

my $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;

setlocale Locale::Messages::LC_MESSAGES(), q{};
textdomain 'com.lmscloud.eventmanagement';
bind_textdomain_filter 'com.lmscloud.eventmanagement', \&Encode::decode_utf8;
bindtextdomain 'com.lmscloud.eventmanagement' => $self->bundle_path . '/locales/';

my $json = JSON::MaybeXS->new->utf8->allow_nonref;

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

sub get {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $key   = $c->param('key');
        my $value = $self->retrieve_data($key);

        return $c->render(
            status  => 200,
            openapi => { plugin_key => $key, plugin_value => $value }
        );
    }
    catch {
        $c->unhandled_exception($_);
    };
}

sub update {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $key  = $c->param('key');
        my $body = $c->req->json;

        my $value_to_store = $body->{'plugin_value'};

        # JSON-encode the value before storing (consistent with add method)
        my $json_value = $json->encode($value_to_store);

        $self->store_data( { $key => $json_value } );

        return $c->render(
            status  => 200,
            openapi => { plugin_key => $key, plugin_value => $value_to_store }
        );
    }
    catch {
        $c->unhandled_exception($_);
    };
}

sub delete {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $key = $c->param('key');

        my $sql = SQL::Abstract->new;
        my $dbh = C4::Context->dbh;

        my ( $stmt, @bind ) = $sql->select(
            'plugin_data',
            q{*},
            {   plugin_class => 'Koha::Plugin::Com::LMSCloud::EventManagement',
                plugin_key   => $key
            }
        );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $setting_to_delete = $sth->fetchrow_hashref();
        if ( !$setting_to_delete ) {
            return $c->render(
                status  => 404,
                openapi => { error => 'Setting not found' }
            );
        }

        ( $stmt, @bind ) = $sql->delete(
            'plugin_data',
            {   plugin_class => 'Koha::Plugin::Com::LMSCloud::EventManagement',
                plugin_key   => $key
            }
        );
        $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        return $c->render( status => 204, openapi => q{} );
    }
    catch {
        $c->unhandled_exception($_);
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
        my $decoded_plugin_value = eval { $json->decode($plugin_value); };

        # Skip only if there was an actual decode error, not if value is falsy
        if ($@) {
            next;
        }

        $setting->{'plugin_value'} = $decoded_plugin_value;
    }

    return $settings;
}

1;
