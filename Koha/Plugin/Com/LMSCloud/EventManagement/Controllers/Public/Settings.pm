package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Public::Settings;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use C4::Context ();

use Try::Tiny     qw( catch try );
use SQL::Abstract ();
use JSON::MaybeXS ();

use Locale::TextDomain ( 'com.lmscloud.eventmanagement', undef );
use Locale::Messages qw(
    bind_textdomain_filter
    bindtextdomain
    setlocale
    textdomain
);

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

sub _get_settings {
    my $sql = SQL::Abstract->new;
    my $dbh = C4::Context->dbh;

    # We can only allow the settings from the schema.sql to be shown for security reasons
    my ( $stmt, @bind ) = $sql->select(
        'plugin_data',
        [ 'plugin_key', 'plugin_value' ],
        {   'plugin_class' => 'Koha::Plugin::Com::LMSCloud::EventManagement',
            'plugin_key'   => { -in => [ 'opac_filters_age_enabled', 'opac_filters_registration_and_dates_enabled', 'opac_filters_fee_enabled' ] }
        }
    );
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
