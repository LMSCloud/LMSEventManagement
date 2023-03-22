package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Public::Events;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use C4::Context;
use Try::Tiny;
use JSON;
use SQL::Abstract;
use Scalar::Util qw(looks_like_number reftype);
use List::Util qw(any);

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

    my $params = {
        name              => $c->validation->param('name'),
        event_type        => $c->validation->every_param('event_type'),
        target_group      => $c->validation->every_param('target_group'),
        min_age           => $c->validation->param('min_age'),
        max_age           => $c->validation->param('max_age'),
        open_registration => $c->validation->param('open_registration'),
        fee               => $c->validation->param('fee'),
        location          => $c->validation->every_param('location'),
        start_time        => $c->validation->param('start_time'),
        end_time          => $c->validation->param('end_time'),
    };

    # every_param returns an array ref, so we need to check if it's empty
    foreach my $key ( keys $params->%* ) {
        if ( ref $params->{$key} eq 'ARRAY' ) {
            $params->{$key} = undef if !@{ $params->{$key} };
        }
    }

    return try {
        my $sql = SQL::Abstract->new;
        my $dbh = C4::Context->dbh;

        use Data::Dumper;
        warn Dumper $params;

        # If the values of all the parameters are undef, we return all the events.
        if ( !any {defined} values $params->%* ) {
            my ( $stmt, @bind ) = $sql->select( $EVENTS_TABLE, q{*}, { start_time => { '>=' => 'CURDATE()' } } );
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

        # Build the WHERE clause based on the specified parameters
        my $where = {};
        $where->{name}              = $params->{name}                            if defined $params->{name} && $params->{name} ne q{};
        $where->{event_type}        = { -in => $params->{event_type} }           if ( defined $params->{event_type} && @{ $params->{event_type} } );
        $where->{target_group}      = { -in => $params->{target_group} }         if ( defined $params->{target_group} && @{ $params->{target_group} } );
        $where->{min_age}           = { '>=' => $params->{min_age} }             if defined $params->{min_age};
        $where->{max_age}           = { '<=' => $params->{max_age} }             if defined $params->{max_age};
        $where->{open_registration} = $params->{open_registration}               if defined $params->{open_registration};
        $where->{fee}               = { '<=' => $params->{fee} }                 if defined $params->{fee};
        $where->{location}          = { -in => $params->{location} }             if ( defined $params->{location} && @{ $params->{location} } );
        $where->{start_time}        = { '>=' => $params->{start_time} }          if defined $params->{start_time};
        $where->{end_time}          = { '<=' => "$params->{end_time} 23:59:59" } if defined $params->{end_time} && $params->{end_time} ne q{};

        my ( $stmt, @bind ) = $sql->select( $EVENTS_TABLE, q{*}, $where );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        warn Dumper $stmt;

        my $events = $sth->fetchall_arrayref( {} );

        if ( !( scalar @{$events} ) ) {
            return $c->render(
                status  => 404,
                openapi => { error => 'Not Found' }
            );
        }

        return $c->render(
            status  => 200,
            openapi => $events,
        );
    }
    catch {
        $c->unhandled_exception($_);
    };
}

1;
