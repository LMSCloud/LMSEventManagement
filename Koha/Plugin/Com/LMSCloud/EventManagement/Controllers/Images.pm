package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Images;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use Try::Tiny qw( catch try );

use Locale::TextDomain ();
use Locale::Messages   qw( bind_textdomain_filter bindtextdomain textdomain );
use POSIX              qw( setlocale );
use Encode             ();

use Koha::UploadedFiles                                              ();
use MIME::Base64                                                     ();
use File::Slurp                                                      ();
use Koha::Plugin::Com::LMSCloud::EventManagement::Adapters::Uploader ();
use Koha::Plugin::Com::LMSCloud::EventManagement;

our $VERSION = '1.0.0';

my $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;

setlocale Locale::Messages::LC_MESSAGES(), q{};
textdomain 'com.lmscloud.eventmanagement';
bind_textdomain_filter 'com.lmscloud.eventmanagement', \&Encode::decode_utf8;
bindtextdomain 'com.lmscloud.eventmanagement' => $self->bundle_path . '/locales/';

sub list {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $uploads = Koha::UploadedFiles->search_term( { term => q{%}, categorycode => 'LMSEventManagement' } );

        my $images = [];
        while ( my $upload = $uploads->next ) {
            my $filename = $upload->filename;
            if ( $filename =~ /[.](?:jpg|jpeg|png|gif|avif|webp)\z/ismx ) {
                push @{$images}, { metadata => $upload->unblessed };
            }
        }

        return $c->render( status => 200, openapi => $images || [] );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub add {
    my $c = shift;

    return try {
        my $lang           = $c->validation->param('lang');
        my $upload_adapter = Koha::Plugin::Com::LMSCloud::EventManagement::Adapters::Uploader->new( { category => 'LMSEventManagement', public => 1, lang => $lang } );

        my $upload      = $c->req->upload('file');
        my $userid      = $c->stash('koha.user')->borrowernumber;
        my $filename    = $upload->{'filename'};
        my $filecontent = $upload->slurp;

        my $rv = $upload_adapter->upload( { filename => $filename, filecontent => $filecontent, userid => $userid } );

        if ( $rv->{'error'} ) {
            return $c->render( status => 500, openapi => { error => $rv->{'error'} } );
        }

        $c->render( status => 201, openapi => {} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
