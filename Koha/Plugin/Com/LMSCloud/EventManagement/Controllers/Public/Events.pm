package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Public::Events;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use Try::Tiny;
use JSON;

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

        my $events = Koha::LMSCloud::EventManagement::Events->search($search_params);

        # Preload event_target_group_fees data for all events
        my $tg_params = { event_id => { '-in' => [ map { $_->id } $events->as_list ] } };

        if ( defined $params->{target_group} && @{ $params->{target_group} } ) {
            $tg_params->{target_group_id} = { '-in' => $params->{target_group} };
        }

        if ( defined $params->{fee} ) {
            $tg_params->{fee} = { '<=' => $params->{fee} };
        }

        my $event_target_group_fees =
            Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees->search( $tg_params, { columns => [ 'event_id', 'target_group_id', 'fee', 'selected' ] } );

        my %fees_by_event_id = map { $_->event_id => [] } $event_target_group_fees->as_list;
        for my $fee ( $event_target_group_fees->as_list ) {
            push @{ $fees_by_event_id{ $fee->event_id } }, $fee->unblessed;
        }

        my $response = [];
        for my $event ( $events->as_list ) {

            # Get the preloaded target group fees for the current event
            my $target_groups = $fees_by_event_id{ $event->id } // [];

            if ( @{$target_groups} ) {
                push @{$response}, { %{ $event->unblessed }, target_groups => $target_groups };
            }
        }

        if ( !$response ) {
            return $c->render(
                status  => 404,
                openapi => []
            );
        }

        return $c->render(
            status  => 200,
            openapi => $response,
        );
    }
    catch {
        $c->unhandled_exception($_);
    };
}

1;
