package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Public::Events;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';
use Try::Tiny;

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
        my $events_set   = Koha::LMSCloud::EventManagement::Events->new;
        my $defined_keys = [ map { defined $params->{$_} ? $_ : () } keys %{$params} ];
        if ( @{$defined_keys} ) {
            $events_set = $events_set->filter($params);
        }
        for my $param ( @{$defined_keys} ) {
            delete $c->validation->output->{$param};
        }

        my $events = $c->objects->search($events_set);

        # Preload event_target_group_fees data for all events
        my $tg_params = { event_id => { '-in' => [ map { $_->{id} } $events->@* ] } };
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
        for my $event ( $events->@* ) {

            # Get the preloaded target group fees for the current event
            my $target_groups = $fees_by_event_id{ $event->{id} } // [];
            if ( @{$target_groups} ) {
                push @{$response}, { %{$event}, target_groups => $target_groups };
            }
        }

        if ( !$events ) {
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
