package Koha::Plugin::Com::LMSCloud::EventManagement::Adapters::Uploader;

use utf8;
use Modern::Perl;
use 5.032;
use English qw( -no_match_vars );

use Carp                ();
use C4::Context         ();
use Koha::UploadedFile  ();
use Koha::UploadedFiles ();
use Digest::MD5 qw( md5_hex );
use Time::HiRes ();
use IO::File    ();
use Readonly    ();
use Locale::TextDomain qw( __ );
use Locale::Messages qw( bind_textdomain_filter bindtextdomain textdomain );
use POSIX qw( setlocale );
use Encode ();

use Koha::Plugin::Com::LMSCloud::EventManagement;

our $VERSION = '1.0.0';

my $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;

setlocale Locale::Messages::LC_MESSAGES(), q{};
textdomain 'com.lmscloud.eventmanagement';
bind_textdomain_filter 'com.lmscloud.eventmanagement', \&Encode::decode_utf8;
bindtextdomain 'com.lmscloud.eventmanagement' => $self->bundle_path . '/locales/';

Readonly::Scalar my $KOHA_UPLOAD     => 'koha_upload';
Readonly::Scalar my $BYTES_DIGEST    => 2048;
Readonly::Scalar my $_10_MB_IN_BYTES => 10 * 1024 * 1024;

sub new {
    my ( $class, $params ) = @_;

    my $self = {};
    bless $self, $class;

    $self->{'rootdir'}  = Koha::UploadedFile->permanent_directory;
    $self->{'category'} = $params->{'category'} || $KOHA_UPLOAD;
    $self->{'public'}   = $params->{'public'} // 0;
    $self->{'lang'}     = $params->{'lang'} || 'en';

    return $self;
}

sub upload {
    my ( $self, $args ) = @_;

    local $ENV{LANGUAGE}       = $self->{'lang'};
    local $ENV{OUTPUT_CHARSET} = 'UTF-8';

    # Computing hash value for the file
    my $hashvalue = md5_hex( $args->{'filename'} . $self->{'category'} . substr $args->{'filecontent'}, 0, $BYTES_DIGEST );

    # Check if a file with the same hashvalue already exists
    my $existing_file = Koha::UploadedFiles->find( { hashvalue => $hashvalue } );
    if ($existing_file) {
        return { error => __('A file with the same content already exists') };
    }

    # Check if the file has an allowed extension
    if ( $args->{'filename'} !~ /[.](?:jpg|jpeg|png|gif|avif|webp)\z/ismx ) {
        return { error => __('File type is not allowed. Only jpg, jpeg, png, gif, avif, and webp files are allowed.') };
    }

    # Check if the file size is less than or equal to 10MB
    my $filesize = length( $args->{'filecontent'} );    # gets the size of filecontent in bytes
    if ( $filesize > $_10_MB_IN_BYTES ) {
        return { error => __('File size exceeds 10MB limit') };
    }

    my $dir = $self->{'rootdir'} . q{/} . $self->{'category'};
    if ( !-d $dir ) {
        mkdir $dir;
    }

    # Filename preparation for storage
    my $stored_filename = $hashvalue . '_' . $args->{'filename'};

    my $file_path = "$dir/$stored_filename";
    open my $fh, '>', $file_path or return { error => __('Could not open file') . "'$file_path' $OS_ERROR" };
    syswrite $fh, $args->{'filecontent'} or return { error => __('Could not write to file') . "'$file_path' $OS_ERROR" };
    close $fh or return { error => __('Could not close file') . "'$file_path' $OS_ERROR" };

    # Register the file in the database
    my $uploaded_file = Koha::UploadedFile->new(
        {   hashvalue          => $hashvalue,
            filename           => $args->{'filename'},
            dir                => $self->{'category'},
            filesize           => $filesize,             # Use calculated filesize
            owner              => $args->{'userid'},
            uploadcategorycode => $self->{'category'},
            public             => $self->{'public'},
            permanent          => 1,
        }
    )->store;

    # check if file was stored successfully
    if ( !$uploaded_file ) {
        return { error => __('Failed to store uploaded file in database') };
    }

    return $uploaded_file;
}

1;

