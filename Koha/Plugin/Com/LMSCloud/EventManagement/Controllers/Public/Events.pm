package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Public::Events;

use 5.032;

use Modern::Perl;
use utf8;

use Mojo::Base 'Mojolicious::Controller';

use DateTime;
use DateTime::Format::Strptime;
use List::Util qw(none);
use Try::Tiny;

use Koha::Plugin::Com::LMSCloud::EventManagement;
use Koha::LMSCloud::EventManagement::Events;
use Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees;

our $VERSION = '1.0.0';

sub count {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $events_set         = Koha::LMSCloud::EventManagement::Events->new;
        my $events_total_count = $events_set->count;

        return $c->render(
            status  => 200,
            openapi => $events_total_count,
        );
    }
    catch {
        $c->unhandled_exception($_);
    };
}

sub get {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $params = _normalize_params($c);
        my $events = _filter_events( $c, $params );

        _interlace_target_groups($events);

        if ( !$events ) {
            return $c->render( status => 404, openapi => [] );
        }

        return $c->render( status => 200, openapi => $events );
    }
    catch {
        $c->unhandled_exception($_);
    };
}

sub _normalize_params {
    my ($c) = @_;

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

    for my $key ( keys $params->%* ) {
        if ( ref $params->{$key} eq 'ARRAY' && none {defined} @{ $params->{$key} } ) {
            $params->{$key} = undef;
        }
    }

    return $params;
}

sub _filter_events {
    my ( $c, $params ) = @_;

    my $events_set = Koha::LMSCloud::EventManagement::Events->new;
    if ( my @defined_keys = grep { defined $params->{$_} } keys %{$params} ) {
        delete $c->validation->output->{$_} for @defined_keys;
    }
    $events_set = $events_set->filter($params);

    $events_set = $events_set->are_upcoming;

    my $fees_set       = Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees->new;
    my $fees_event_ids = [
        $fees_set->search(
            $events_set->compose_fees_search_params($params),
            {   column   => ['event_id'],
                distinct => 1,
            }
        )->get_column('event_id')
    ];

    $events_set = $events_set->search( { 'me.id' => { -in => $fees_event_ids } } );

    return $c->objects->search($events_set);
}

sub _interlace_target_groups {
    my ($events) = @_;

    my $fees_set = Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees->new;
    for my $event ( @{$events} ) {
        my $target_groups = $fees_set->search( { event_id => $event->{'id'} } );
        $event->{'target_groups'} = $target_groups->as_list;
    }
}

1;
