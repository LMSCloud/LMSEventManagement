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

my $EVENTS_TABLE                  = $self ? $self->get_qualified_table_name('events')    : undef;
my $EVENT_TARGET_GROUP_FEES_TABLE = $self ? $self->get_qualified_table_name('e_tg_fees') : undef;

sub list {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $sql = SQL::Abstract->new;
        my $dbh = C4::Context->dbh;

        my ( $stmt, @bind ) = $sql->select( $EVENTS_TABLE, q{*} );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $events = $sth->fetchall_arrayref( {} );

        foreach my $event ( @{$events} ) {
            ( $stmt, @bind ) = $sql->select( $EVENT_TARGET_GROUP_FEES_TABLE, [ 'target_group_id', 'selected', 'fee' ], { event_id => $event->{id} } );
            $sth = $dbh->prepare($stmt);
            $sth->execute(@bind);

            my $target_groups = $sth->fetchall_arrayref( {} );
            $event->{'target_groups'} = $target_groups;
        }

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

        my $target_groups = delete $new_event->{'target_groups'};

        my ( $stmt, @bind ) = $sql->insert( $EVENTS_TABLE, $new_event );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $id = $dbh->last_insert_id( undef, undef, $EVENTS_TABLE, undef );

        if ($target_groups) {
            for my $target_group ( $target_groups->@* ) {
                ( $stmt, @bind ) = $sql->insert(
                    $EVENT_TARGET_GROUP_FEES_TABLE,
                    {   event_id        => $id,
                        target_group_id => $target_group->{'id'},
                        selected        => $target_group->{'selected'},
                        fee             => $target_group->{'fee'},
                    }
                );
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

1;
