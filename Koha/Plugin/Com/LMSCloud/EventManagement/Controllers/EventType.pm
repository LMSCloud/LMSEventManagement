package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::EventType;

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

my $EVENT_TYPES_TABLE                  = $self ? $self->get_qualified_table_name('event_types') : undef;
my $EVENT_TYPE_TARGET_GROUP_FEES_TABLE = $self ? $self->get_qualified_table_name('et_tg_fees')  : undef;

sub get {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $id  = $c->validation->param('id');
        my $sql = SQL::Abstract->new;
        my $dbh = C4::Context->dbh;

        my ( $stmt, @bind ) = $sql->select( $EVENT_TYPES_TABLE, q{*}, { id => $id } );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $event_type = $sth->fetchrow_hashref;

        ( $stmt, @bind ) = $sql->select( $EVENT_TYPE_TARGET_GROUP_FEES_TABLE, [qw/target_group fee/], { event_type_id => $id }, );
        $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $fees = $sth->fetchall_arrayref( {} );
        $event_type->{fees} = $fees;

        return $c->render( status => 200, openapi => $event_type || {} );
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

        # We get our data for the new event type from the request body
        my $json           = $c->req->body;
        my $new_event_type = decode_json($json);

        # Extract the fees from the new event type
        my $target_groups = delete $new_event_type->{'target_groups'};

        # Update the event type record
        my ( $stmt, @bind ) = $sql->update( $EVENT_TYPES_TABLE, $new_event_type, { id => $id } );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        if ($target_groups) {

            # Delete existing target group fees records
            ( $stmt, @bind ) = $sql->delete( $EVENT_TYPE_TARGET_GROUP_FEES_TABLE, { event_type_id => $id } );
            $sth = $dbh->prepare($stmt);
            $sth->execute(@bind);

            # Insert new target group fees records
            for my $target_group ( $target_groups->@* ) {
                my $record = { event_type_id => $id, target_group_id => $target_group->{'id'}, selected => $target_group->{'selected'}, fee => $target_group->{'fee'} };
                ( $stmt, @bind ) = $sql->insert( $EVENT_TYPE_TARGET_GROUP_FEES_TABLE, $record );
                $sth = $dbh->prepare($stmt);
                $sth->execute(@bind);
            }
        }

        # Fetch the updated event type record
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

sub delete {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $id  = $c->validation->param('id');
        my $sql = SQL::Abstract->new;
        my $dbh = C4::Context->dbh;

        # delete the entries from the junction table first
        my ( $junction_stmt, @junction_bind ) = $sql->delete( $EVENT_TYPE_TARGET_GROUP_FEES_TABLE, { event_type_id => $id } );
        my $junction_sth = $dbh->prepare($junction_stmt);
        $junction_sth->execute(@junction_bind);

        # then delete the event type
        my ( $stmt, @bind ) = $sql->delete( $EVENT_TYPES_TABLE, { id => $id } );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        return $c->render( status => 200, openapi => {} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
