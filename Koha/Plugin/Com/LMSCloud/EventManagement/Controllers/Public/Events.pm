package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Public::Events;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use Try::Tiny;
use JSON;
use List::Util qw(any);

use Koha::Plugin::Com::LMSCloud::EventManagement;
use Koha::LMSCloud::EventManagement::Events;
use Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees;

our $VERSION = '1.0.0';

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
        my $search_params = {};

        $search_params->{name}              = { 'like' => $params->{name} }              if defined $params->{name} && $params->{name} ne q{};
        $search_params->{event_type}        = $params->{event_type}                      if ( defined $params->{event_type} && @{ $params->{event_type} } );
        $search_params->{min_age}           = { '>=' => $params->{min_age} }             if defined $params->{min_age};
        $search_params->{max_age}           = { '<=' => $params->{max_age} }             if defined $params->{max_age};
        $search_params->{open_registration} = $params->{open_registration}               if defined $params->{open_registration} && !$params->{open_registration};
        $search_params->{location}          = $params->{location}                        if ( defined $params->{location} && @{ $params->{location} } );
        $search_params->{start_time}        = { '>=' => $params->{start_time} }          if defined $params->{start_time};
        $search_params->{end_time}          = { '<=' => "$params->{end_time} 23:59:59" } if defined $params->{end_time} && $params->{end_time} ne q{};

        my @events = Koha::LMSCloud::EventManagement::Events->search($search_params);

        my @filtered_events;
        foreach my $event (@events) {
            if ( defined $params->{target_group} && @{ $params->{target_group} } || defined $params->{fee} ) {
                my $event_target_group_fees = Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees->search( { event_id => $event->{id} } );

                if ( defined $params->{target_group} && @{ $params->{target_group} } ) {
                    $event_target_group_fees = $event_target_group_fees->search( { target_group_id => $params->{target_group} } );
                }

                if ( defined $params->{fee} ) {
                    $event_target_group_fees = $event_target_group_fees->search( { fee => { '<=' => $params->{fee} } } );
                }

                if ( $event_target_group_fees->count ) {
                    $event->{target_groups} = $event_target_group_fees->unblessed;
                    push @filtered_events, $event->unblessed;
                }
            }
            else {
                $event->{target_groups} = Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees->search( { event_id => $event->{id}, selected => 1 } )->unblessed;
                push @filtered_events, $event->unblessed;
            }
        }

        use Data::Dumper;
        warn Dumper \@filtered_events;

        if ( !scalar @filtered_events ) {
            return $c->render(
                status  => 404,
                openapi => []
            );
        }

        return $c->render(
            status  => 200,
            openapi => \@filtered_events,
        );
    }
    catch {
        $c->unhandled_exception($_);
    };
}

1;
