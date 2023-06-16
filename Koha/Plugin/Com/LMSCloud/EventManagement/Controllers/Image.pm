package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Image;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';
use Try::Tiny;

use Koha::UploadedFiles;
use MIME::Base64;
use File::Slurp 'slurp';

our $VERSION = '1.0.0';

sub add {
    my $c = shift->openapi->valid_input or return;

    my $upload = $c->req->upload('file');    # <-- Get the uploaded file

    return try {
        my $file = {
            filename => $upload->filename,
            mimetype => $upload->headers->content_type,
            size     => $upload->size,
            content  => scalar $upload->slurp,            # <-- Get the file content
        };

        my $uploadedFile = Koha::UploadedFiles->new(
            {   filename => $file->{'filename'},
                mimetype => $file->{'mimetype'},
                size     => $file->{'size'},
            }
        );
        $uploadedFile->store( $file->{'content'} );

        my $image = {
            image    => encode_base64( $file->{'content'} ),
            metadata => $uploadedFile->unblessed,
        };

        return $c->render( status => 200, openapi => {} );    # $image );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
