package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Images;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';
use Try::Tiny;

use Koha::UploadedFiles;
use MIME::Base64;
use File::Slurp 'slurp';

our $VERSION = '1.0.0';

sub list {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $uploads = Koha::UploadedFiles->search_term( { term => q{%} } );

        my $images = [];
        while ( my $upload = $uploads->next ) {
            my $file_handle   = $upload->file_handle;
            my $file_contents = slurp($file_handle);
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

