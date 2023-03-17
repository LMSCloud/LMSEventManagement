package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Images;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use C4::Context;
use Try::Tiny;
use JSON;
use SQL::Abstract;
use Scalar::Util qw(looks_like_number reftype);

use Koha::UploadedFiles;
use MIME::Base64;

our $VERSION = '1.0.0';

sub list {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $uploads = Koha::UploadedFiles->search_term( { term => q{%} } );

        my $images = [];
        while ( my $upload = $uploads->next ) {
            my $file_handle = $upload->file_handle;
            my $buffer;
            my $file_contents;
            while ( my $bytes_read = $file_handle->read( $buffer, 1024 ) ) {
                $file_contents .= $buffer;
            }
            push @{$images},
                {
                image    => encode_base64($file_contents),
                metadata => $upload->unblessed,
                };
        }

        return $c->render( status => 200, openapi => $images || [] );
    }
    catch {
        return $c->unhandled_exception($_);
    };

}

1;

