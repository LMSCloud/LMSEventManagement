package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Image;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use Try::Tiny qw( catch try );

use Locale::TextDomain qw( __ );
use Locale::Messages   qw( bind_textdomain_filter bindtextdomain textdomain );
use POSIX              qw( setlocale );
use Encode             ();

use Koha::UploadedFiles ();

our $VERSION = '1.0.0';

my $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;

setlocale Locale::Messages::LC_MESSAGES(), q{};
textdomain 'com.lmscloud.eventmanagement';
bind_textdomain_filter 'com.lmscloud.eventmanagement', \&Encode::decode_utf8;
bindtextdomain 'com.lmscloud.eventmanagement' => $self->bundle_path . '/locales/';

sub delete {
    my $c = shift->openapi->valid_input or return;

    return try {
        local $ENV{LANGUAGE}       = $c->validation->param('lang') || 'en';
        local $ENV{OUTPUT_CHARSET} = 'UTF-8';
        my $hashvalue = $c->validation->param('hashvalue');

        my $file = Koha::UploadedFiles->find( { hashvalue => $hashvalue } );
        if ( !$file ) {
            return $c->render( status => 404, openapi => { message => __('File not found') } );
        }

        $file->delete;

        $c->render( status => 204, openapi => {} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
