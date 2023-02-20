package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::TargetGroup;

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

my $TARGET_GROUPS_TABLE = $self ? $self->get_qualified_table_name('target_groups') : undef;

sub get {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $id  = $c->validation->param('id');
        my $sql = SQL::Abstract->new;
        my $dbh = C4::Context->dbh;

        my ( $stmt, @bind ) = $sql->select( $TARGET_GROUPS_TABLE, q{*}, { id => $id } );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $target_group = $sth->fetchrow_hashref;

        return $c->render( status => 200, openapi => $target_group || {} );
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

        # We get our data for the new target group from the request body
        my $json             = $c->req->body;
        my $new_target_group = decode_json($json);

        my ( $stmt, @bind ) = $sql->insert( $TARGET_GROUPS_TABLE, $new_target_group );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $id = $dbh->last_insert_id( undef, undef, $TARGET_GROUPS_TABLE, undef );

        ( $stmt, @bind ) = $sql->select( $TARGET_GROUPS_TABLE, q{*}, { id => $id } );
        $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $target_group = $sth->fetchrow_hashref;

        return $c->render( status => 200, openapi => $target_group || {} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub update {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $id  = $c->validation->param('id');
        my $sql = SQL::Abstract->new;
        my $dbh = C4::Context->dbh;

        # We get our data for the new target group from the request body
        my $json             = $c->req->body;
        my $new_target_group = decode_json($json);

        my ( $stmt, @bind ) = $sql->update( $TARGET_GROUPS_TABLE, $new_target_group, { id => $id } );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        ( $stmt, @bind ) = $sql->select( $TARGET_GROUPS_TABLE, q{*}, { id => $id } );
        $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $target_group = $sth->fetchrow_hashref;

        return $c->render( status => 200, openapi => $target_group || {} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub delete {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $id  = $c->validation->param('id');
        my $sql = SQL::Abstract->new;
        my $dbh = C4::Context->dbh;

        my ( $stmt, @bind ) = $sql->delete( $TARGET_GROUPS_TABLE, { id => $id } );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        return $c->render( status => 200, openapi => {} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
