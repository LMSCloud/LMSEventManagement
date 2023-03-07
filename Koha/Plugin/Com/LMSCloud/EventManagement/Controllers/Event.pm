package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Event;

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

my $EVENTS_TABLE                  = $self ? $self->get_qualified_table_name('events')    : undef;
my $EVENT_TARGET_GROUP_FEES_TABLE = $self ? $self->get_qualified_table_name('e_tg_fees') : undef;

sub get {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $id  = $c->validation->param('id');
        my $sql = SQL::Abstract->new;
        my $dbh = C4::Context->dbh;

        my ( $stmt, @bind ) = $sql->select( $EVENTS_TABLE, q{*}, { id => $id } );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $event = $sth->fetchrow_hashref;

        ( $stmt, @bind ) = $sql->select( $EVENT_TARGET_GROUP_FEES_TABLE, [ 'target_group_id', 'selected', 'fee' ], { event_id => $event->{id} } );
        $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $target_groups = $sth->fetchall_arrayref( {} );

        return $c->render( status => 200, openapi => { %{$event}, target_groups => $target_groups } || {} );
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

        my $json      = $c->req->body;
        my $new_event = decode_json($json);

        my $target_groups = delete $new_event->{'target_groups'};

        my ( $stmt, @bind ) = $sql->update( $EVENTS_TABLE, $new_event, { id => $id } );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        if ($target_groups) {

            # Delete existing target group fees records
            ( $stmt, @bind ) = $sql->delete( $EVENT_TARGET_GROUP_FEES_TABLE, { event_id => $id } );
            $sth = $dbh->prepare($stmt);
            $sth->execute(@bind);

            # Insert new target group fees records
            for my $target_group ( $target_groups->@* ) {
                my $record = { event_id => $id, target_group_id => $target_group->{'id'}, selected => $target_group->{'selected'}, fee => $target_group->{'fee'} };
                ( $stmt, @bind ) = $sql->insert( $EVENT_TARGET_GROUP_FEES_TABLE, $record );
                $sth = $dbh->prepare($stmt);
                $sth->execute(@bind);
            }
        }

        ( $stmt, @bind ) = $sql->select( $EVENTS_TABLE, q{*}, { id => $id } );
        $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $event = $sth->fetchrow_hashref;

        ( $stmt, @bind ) = $sql->select( $EVENT_TARGET_GROUP_FEES_TABLE, [ 'target_group_id', 'selected', 'fee' ], { event_id => $event->{id} } );
        $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        $target_groups = $sth->fetchall_arrayref( {} );

        return $c->render( status => 200, openapi => { %{$event}, target_groups => $target_groups } || {} );
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
        my ( $junction_stmt, @junction_bind ) = $sql->delete( $EVENT_TARGET_GROUP_FEES_TABLE, { event_id => $id } );
        my $junction_sth = $dbh->prepare($junction_stmt);
        $junction_sth->execute(@junction_bind);

        my ( $stmt, @bind ) = $sql->delete( $EVENTS_TABLE, { id => $id } );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        return $c->render( status => 200, openapi => {} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
