package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::EventTypes;

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

our $VERSION = '1.0.0';

my $self = undef;
if ( Koha::Plugin::Com::LMSCloud::EventManagement->can('new') ) {
    $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;
}

my $EVENT_TYPES_TABLE = $self ? $self->get_qualified_table_name('event_types') : undef;

sub list {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $sql = SQL::Abstract->new;
        my $dbh = C4::Context->dbh;

        my ( $stmt, @bind ) = $sql->select( $EVENT_TYPES_TABLE, q{*} );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $event_types = $sth->fetchall_arrayref( {} );

        return $c->render( status => 200, openapi => $event_types || [] );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub add {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $sql = SQL::Abstract->new;
        my $dbh = C4::Context->dbh;

        # We get our data for the new event type from the request body
        my $json           = $c->req->body;
        my $new_event_type = decode_json($json);

        my ( $stmt, @bind ) = $sql->insert( $EVENT_TYPES_TABLE, $new_event_type );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $id = $dbh->last_insert_id( undef, undef, $EVENT_TYPES_TABLE, undef );

        ( $stmt, @bind ) = $sql->select( $EVENT_TYPES_TABLE, q{*}, { id => $id } );
        $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $event_type = $sth->fetchrow_hashref;

        return $c->render( status => 200, openapi => $event_type || {} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
