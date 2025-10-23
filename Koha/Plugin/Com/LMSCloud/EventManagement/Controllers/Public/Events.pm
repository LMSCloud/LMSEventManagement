package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Public::Events;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use JSON       qw( decode_json encode_json );
use List::Util qw( none );
use Try::Tiny  qw( catch try );
use Readonly   qw( Readonly );

use Koha::LMSCloud::EventManagement::Events                   ();
use Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees ();
use Koha::LMSCloud::EventManagement::Locations                ();
use Koha::LMSCloud::EventManagement::ICalendar                ();

our $VERSION = '1.0.0';

Readonly my $NAMESPACE_INDEX => 4;

sub get {
    my $c = shift->openapi->valid_input or return;

    return try {

        # Fix ambiguous column names in q parameter before processing
        if ( $c->validation->output->{'q'} ) {
            _fix_q_parameter_column_ambiguity($c);
        }

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

sub export_ical {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $id    = $c->validation->param('id');
        my $event = Koha::LMSCloud::EventManagement::Events->find($id);

        if ( !$event ) {
            return $c->render( status => 404, openapi => { error => 'Event not found' } );
        }

        my $location = Koha::LMSCloud::EventManagement::Locations->find( $event->location );

        my $ical_data = Koha::LMSCloud::EventManagement::ICalendar::generate_event_ical( $event, $location );

        my $filename = join q{}, 'event-', $event->id, '.ics';
        $c->res->headers->content_type('text/calendar; charset=utf-8');
        $c->res->headers->content_disposition(qq{attachment; filename="$filename"});

        return $c->render( data => $ical_data );
    }
    catch {
        return $c->unhandled_exception($_);
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

    my $events_set   = Koha::LMSCloud::EventManagement::Events->new;
    my $defined_keys = [ grep { defined $params->{$_} } keys %{$params} ];
    if ( @{$defined_keys} ) {
        for my $defined_key ( @{$defined_keys} ) {
            delete $c->validation->output->{$defined_key};
        }
    }
    $events_set = $events_set->filter($params);

    $events_set = $events_set->are_upcoming;

    my $url            = $c->req->url;
    my $path           = $url->to_abs->path;
    my $is_public      = $path->parts->[$NAMESPACE_INDEX] eq 'public';
    my $fees_set       = Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees->new;
    my $fees_event_ids = [
        $fees_set->search(
            $events_set->compose_fees_search_params( $params, $is_public ),
            {   column   => ['event_id'],
                distinct => 1,
            }
        )->get_column('event_id')
    ];

    $events_set = $events_set->search(
        { 'me.id' => { -in => $fees_event_ids } },
        {   join      => 'location',
            '+select' => ['location.name'],
            '+as'     => ['location_name'],
        }
    );

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

sub _fix_q_parameter_column_ambiguity {
    my ($c) = @_;

    my $q_param = $c->validation->output->{q};
    if ( !defined $q_param || $q_param eq '{}' ) {
        return;
    }

    my $q_json;
    eval { $q_json = decode_json($q_param); };
    if ($@) {
        return;
    }

    if ( ref $q_json eq 'HASH' && !keys %{$q_json} ) {
        return;
    }
    if ( ref $q_json eq 'ARRAY' && !@{$q_json} ) {
        return;
    }

    _fix_name_refs_recursive($q_json);

    $c->validation->output->{q} = encode_json($q_json);
}

sub _fix_name_refs_recursive {
    my ($obj) = @_;

    if ( ref $obj eq 'HASH' ) {
        if ( exists $obj->{name} && !exists $obj->{'me.name'} ) {
            $obj->{'me.name'} = delete $obj->{name};
        }
        for my $value ( values %{$obj} ) {
            _fix_name_refs_recursive($value);
        }
    }
    elsif ( ref $obj eq 'ARRAY' ) {
        for my $element ( @{$obj} ) {
            _fix_name_refs_recursive($element);
        }
    }
}

1;
