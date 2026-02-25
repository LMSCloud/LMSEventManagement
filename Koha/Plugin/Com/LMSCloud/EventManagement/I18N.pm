package Koha::Plugin::Com::LMSCloud::EventManagement::I18N;

use Modern::Perl;
use utf8;

use Encode qw( decode_utf8 );
use Locale::Messages qw(
    bind_textdomain_filter
    bindtextdomain
    setlocale
    textdomain
);

use Koha::Plugin::Com::LMSCloud::EventManagement ();

my $initialized;

sub import {
    return if $initialized;

    my $plugin = Koha::Plugin::Com::LMSCloud::EventManagement->new;

    setlocale Locale::Messages::LC_MESSAGES(), q{};
    textdomain 'com.lmscloud.eventmanagement';
    bind_textdomain_filter 'com.lmscloud.eventmanagement', \&decode_utf8;
    bindtextdomain 'com.lmscloud.eventmanagement' => $plugin->bundle_path . '/locales/';

    $initialized = 1;
    return;
}

1;
