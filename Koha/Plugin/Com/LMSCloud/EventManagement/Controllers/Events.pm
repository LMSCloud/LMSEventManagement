package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Events;

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

my $EVENTS_TABLE = $self ? $self->get_qualified_table_name('events') : undef;

sub list {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $sql = SQL::Abstract->new;
        my $dbh = C4::Context->dbh;

        my ( $stmt, @bind ) = $sql->select( $EVENTS_TABLE, q{*} );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $events = $sth->fetchall_arrayref( {} );

        return $c->render( status => 200, openapi => $events || [] );
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
        my $json      = $c->req->body;
        my $new_event = decode_json($json);

        my ( $stmt, @bind ) = $sql->insert( $EVENTS_TABLE, $new_event );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $id = $dbh->last_insert_id( undef, undef, $EVENTS_TABLE, undef );

        ( $stmt, @bind ) = $sql->select( $EVENTS_TABLE, q{*}, { id => $id } );
        $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $event = $sth->fetchrow_hashref;

        return $c->render( status => 200, openapi => $event || {} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
