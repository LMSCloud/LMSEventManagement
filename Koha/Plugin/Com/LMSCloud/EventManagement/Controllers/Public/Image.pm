package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Public::Image;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use Mojo::Asset::File;
use Readonly  qw( Readonly );
use Try::Tiny qw( catch try );

use Locale::Messages qw(
    bind_textdomain_filter
    bindtextdomain
    setlocale
    textdomain
);
use Locale::TextDomain ( 'com.lmscloud.eventmanagement', undef );

use Koha::UploadedFiles ();

our $VERSION = '1.0.0';

my $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;

setlocale Locale::Messages::LC_MESSAGES(), q{};
textdomain 'com.lmscloud.eventmanagement';
bind_textdomain_filter 'com.lmscloud.eventmanagement', \&Encode::decode_utf8;
bindtextdomain 'com.lmscloud.eventmanagement' => $self->bundle_path . '/locales/';

Readonly::Scalar my $OK                => 200;
Readonly::Scalar my $DAYS_TO_CACHE     => 30;
Readonly::Scalar my $HOURS_IN_DAY      => 24;
Readonly::Scalar my $MINUTES_IN_HOUR   => 60;
Readonly::Scalar my $SECONDS_IN_MINUTE => 60;
Readonly::Scalar my $SECONDS_TO_CACHE  => $DAYS_TO_CACHE * $HOURS_IN_DAY * $MINUTES_IN_HOUR * $SECONDS_IN_MINUTE;
Readonly my $MIME_TYPES => {
    'png'  => 'image/png',
    'jpg'  => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'webp' => 'image/webp',
    'avif' => 'image/avif',
    'gif'  => 'image/gif',
};

sub get {
    my $c = shift->openapi->valid_input or return;

    return try {
        local $ENV{LANGUAGE}       = $c->validation->param('lang') || 'en';
        local $ENV{OUTPUT_CHARSET} = 'UTF-8';
        my $hashvalue     = $c->validation->param('hashvalue');
        my $files_rs      = Koha::UploadedFiles->search( { hashvalue => $hashvalue } )->next;
        my $uploaded_file = Koha::UploadedFiles->find( $files_rs->id );

        if ( !$uploaded_file || !$uploaded_file->public ) {
            return $c->render( status => 404, openapi => { message => __('File not found or not public') } );
        }

        my $filepath = $uploaded_file->full_path;

        # Check if file exists
        if ( !-e $filepath ) {
            return $c->render( status => 404, openapi => { message => __('File does not exist') } );
        }

        # Get file extension
        my $file_extension = _parse_extension($filepath);

        # Return an error if the file type is unsupported
        if ( !( exists $MIME_TYPES->{$file_extension} ) ) {
            return $c->render( status => 400, openapi => { message => __('Unsupported file type') } );
        }

        # Get MIME type from the mapping
        my $mime_type = $MIME_TYPES->{$file_extension};

        # Set appropriate content type
        $c->res->headers->content_type($mime_type);

        # Set Cache-Control header for browser caching
        $c->res->headers->cache_control("public, max-age=$SECONDS_TO_CACHE");

        $c->res->headers->content_disposition( q{attachment; filename*=UTF-8''} . $uploaded_file->filename );
        $c->res->content->asset( Mojo::Asset::File->new( path => $filepath ) );
        $c->rendered($OK);

    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub _parse_extension {
    my ($filepath) = @_;

    my $parts = [ split /[.]/smx, $filepath ];
    if ( scalar @{$parts} > 1 ) {
        return $parts->[-1];
    }

    return;
}

1;
