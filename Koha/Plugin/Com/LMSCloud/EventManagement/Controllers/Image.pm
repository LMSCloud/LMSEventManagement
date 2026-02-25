package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Image;


use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use Try::Tiny qw( catch try );

use Locale::TextDomain ( 'com.lmscloud.eventmanagement', undef );

use Koha::Plugin::Com::LMSCloud::EventManagement::I18N;

use Koha::UploadedFiles ();

our $VERSION = '1.0.0';


sub delete {
    my $c = shift->openapi->valid_input or return;

    return try {
        local $ENV{LANGUAGE}       = $c->validation->param('lang') || 'en';
        local $ENV{OUTPUT_CHARSET} = 'UTF-8';
        my $hashvalue = $c->validation->param('hashvalue');

        my $file = Koha::UploadedFiles->find( { hashvalue => $hashvalue, uploadcategorycode => 'LMSEventManagement' } );
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
