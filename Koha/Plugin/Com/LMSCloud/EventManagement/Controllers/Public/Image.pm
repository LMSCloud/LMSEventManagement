package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Public::Image;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';
use Try::Tiny;

use Readonly;
use Mojo::Asset::File;
use Koha::UploadedFiles;

our $VERSION = '1.0.0';

Readonly::Scalar my $OK => 200;

sub get {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $hashvalue     = $c->validation->param('hashvalue');
        my $files_rs      = Koha::UploadedFiles->search( { hashvalue => $hashvalue } )->next;
        my $uploaded_file = Koha::UploadedFiles->find( $files_rs->id );

        if ( !$uploaded_file || !$uploaded_file->public ) {
            return $c->render( status => 404, openapi => { message => 'File not found or not public' } );
        }

        my $filepath = $uploaded_file->full_path;

        # Check if file exists
        if ( !-e $filepath ) {
            return $c->render( status => 404, openapi => { message => 'File does not exist' } );
        }

        # Return file directly as a stream
        $c->res->headers->content_type('application/octet-stream');
        $c->res->headers->content_disposition( q{attachment; filename*=UTF-8''} . $uploaded_file->filename );
        $c->res->content->asset( Mojo::Asset::File->new( path => $filepath ) );
        $c->rendered($OK);

    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
