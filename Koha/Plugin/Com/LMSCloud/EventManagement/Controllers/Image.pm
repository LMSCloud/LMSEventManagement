package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Image;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';
use Try::Tiny;

use Koha::UploadedFiles;

our $VERSION = '1.0.0';

sub delete {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $hashvalue = $c->validation->param('hashvalue');

        my $file = Koha::UploadedFiles->find( { hashvalue => $hashvalue } );
        if ( !$file ) {
            return $c->render( status => 404, openapi => { message => 'File not found' } );
        }

        $file->delete;

        $c->render( status => 204, openapi => {} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
