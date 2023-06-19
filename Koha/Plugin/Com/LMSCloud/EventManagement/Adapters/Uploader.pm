package Koha::Plugin::Com::LMSCloud::EventManagement::Adapters::Uploader;

use utf8;
use Modern::Perl;
use 5.032;
use English qw( -no_match_vars );

use Carp;
use C4::Context;
use Koha::UploadedFile;
use Koha::UploadedFiles;
use Digest::MD5 qw(md5_hex);
use Time::HiRes;
use IO::File;
use Readonly;

our $VERSION = '1.0.0';

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

    return $self;
}

sub upload {
    my ( $self, $args ) = @_;

    # Computing hash value for the file
    my $hashvalue = md5_hex( $args->{'filename'} . ( $args->{'userid'} // '0' ) . $self->{'category'} . substr $args->{'filecontent'}, 0, $BYTES_DIGEST );

    # Check if a file with the same hashvalue already exists
    my $existing_file = Koha::UploadedFiles->find( { hashvalue => $hashvalue } );
    if ($existing_file) {
        return { error => 'A file with the same content already exists' };
    }

    # Check if the file has an allowed extension
    if ( $args->{'filename'} !~ /[.](?:jpg|jpeg|png|gif|avif|webp)\z/ismx ) {
        return { error => 'File type is not allowed. Only jpg, jpeg, png, gif, avif, and webp files are allowed.' };
    }

    # Check if the file size is less than or equal to 10MB
    my $filesize = length( $args->{'filecontent'} );    # gets the size of filecontent in bytes
    if ( $filesize > $_10_MB_IN_BYTES ) {
        return { error => 'File size exceeds 10MB limit' };
    }

    my $dir = $self->{'rootdir'} . q{/} . $self->{'category'};
    mkdir $dir if !-d $dir;

    # Filename preparation for storage
    my $stored_filename = $hashvalue . '_' . $args->{'filename'};

    my $file_path = "$dir/$stored_filename";
    open my $fh, '>', $file_path or return { error => "Could not open file '$file_path' $OS_ERROR" };
    syswrite $fh, $args->{'filecontent'} or return { error => "Could not write to file '$file_path' $OS_ERROR" };
    close $fh or return { error => "Could not close file '$file_path' $OS_ERROR" };

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
        return { error => 'Failed to store uploaded file in database' };
    }

    return $uploaded_file;
}

1;

