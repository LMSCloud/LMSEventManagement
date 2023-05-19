package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Events;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';
use Try::Tiny;
use Readonly;
use Locale::TextDomain ( 'com.lmscloud.eventmanagement', undef );
use Locale::Messages qw(:locale_h :libintl_h bind_textdomain_filter);
use POSIX qw(setlocale);
use Encode;
use DateTime;
use DateTime::Format::Strptime;

use Koha::Plugin::Com::LMSCloud::EventManagement;
use Koha::LMSCloud::EventManagement::Event;
use Koha::LMSCloud::EventManagement::Events;
use Koha::LMSCloud::EventManagement::Event::TargetGroup::Fee;
use Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees;
use Koha::Plugin::Com::LMSCloud::EventManagement::lib::Validator;

our $VERSION = '1.0.0';

my $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;

setlocale Locale::Messages::LC_MESSAGES(), q{};
textdomain 'com.lmscloud.eventmanagement';
bind_textdomain_filter 'com.lmscloud.eventmanagement', \&Encode::decode_utf8;
bindtextdomain 'com.lmscloud.eventmanagement' => $self->bundle_path . '/locales/';

Readonly::Scalar my $UPPER_AGE_BOUNDARY          => 255;
Readonly::Scalar my $UPPER_PARTICIPANTS_BOUNDARY => 65535;

sub _validate {
    my ($args) = @_;

    my $validator = Koha::Plugin::Com::LMSCloud::EventManagement::lib::Validator->new( { schema => $args->{'schema'}, lang => $args->{'lang'} } );
    return $validator->validate();
}

sub list {
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

    return try {
        local $ENV{LANGUAGE}       = $c->validation->param('lang') || 'en';
        local $ENV{OUTPUT_CHARSET} = 'UTF-8';
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

            my $has_selected_target_group = 0;
            if ( defined $params->{target_group} && @{ $params->{target_group} } ) {
                for my $target_group ( @{$target_groups} ) {
                    if ( $target_group->{selected} && ( grep { $_ == $target_group->{target_group_id} } @{ $params->{target_group} } ) ) {
                        $has_selected_target_group = 1;
                        last;
                    }
                }
            }
            else {
                for my $target_group ( @{$target_groups} ) {
                    if ( $target_group->{selected} ) {
                        $has_selected_target_group = 1;
                        last;
                    }
                }
            }

            # Only push the event onto the response if a selected target group matches the requested target_groups
            if ($has_selected_target_group) {
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
        return $c->unhandled_exception($_);
    };
}

sub add {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $lang = $c->validation->param('lang') || 'en';
        local $ENV{LANGUAGE}       = $lang;
        local $ENV{OUTPUT_CHARSET} = 'UTF-8';
        my $body = $c->validation->param('body');

        my ( $is_valid, $errors ) = _validate(
            {   schema => [
                    {   key     => __('name'),
                        value   => $body->{'name'},
                        type    => 'string',
                        options => { is_alphanumeric => { skip => 1, }, nullable => 1, },
                    },
                    {   key     => __('max_age'),
                        value   => $body->{'max_age'},
                        type    => 'number',
                        options => {
                            positive => 1,
                            range    => [ 0, $UPPER_AGE_BOUNDARY ],
                            nullable => 1,
                        },
                    },
                    {   key     => __('min_age'),
                        value   => $body->{'min_age'},
                        type    => 'number',
                        options => {
                            positive => 1,
                            range    => [ 0, $UPPER_AGE_BOUNDARY ],
                            nullable => 1,
                        },
                    },
                    {   key     => __('max_participants'),
                        value   => $body->{'max_participants'},
                        type    => 'number',
                        options => {
                            positive => 1,
                            range    => [ 0, $UPPER_PARTICIPANTS_BOUNDARY ],
                            nullable => 1,
                        },
                    },
                    {   key     => __('start_time'),
                        value   => $body->{'start_time'},
                        type    => 'datetime',
                        options => { nullable => 1, },
                    },
                    {   key     => __('end_time'),
                        value   => $body->{'end_time'},
                        type    => 'datetime',
                        options => { nullable => 1, },
                    },
                    {   key     => __('registration_start'),
                        value   => $body->{'registration_start'},
                        type    => 'datetime',
                        options => { nullable => 1, },
                    },
                    {   key     => __('registration_end'),
                        value   => $body->{'registration_end'},
                        type    => 'datetime',
                        options => { nullable => 1, },
                    },
                    {   key     => __('description'),
                        value   => $body->{'description'},
                        type    => 'string',
                        options => {
                            is_alphanumeric    => { skip => 1, },
                            exceeds_max_length => { TEXT => 1, },
                            nullable           => 1,
                        },
                    }
                ],
                lang => $lang
            }
        );

        my $has_selected_target_group = 0;
        my $target_groups             = $body->{'target_groups'} // [];
        for my $target_group ( @{$target_groups} ) {
            if ( $target_group->{'selected'} ) {
                $has_selected_target_group = 1;
                last;
            }
        }

        if ( !$has_selected_target_group ) {
            push @{$errors}, __('At least one target group must be selected.');
            $is_valid = 0;
        }

        if ( !$is_valid ) {
            return $c->render( status => 400, openapi => { error => $errors } );
        }

        $target_groups = delete $body->{'target_groups'};

        my $event = Koha::LMSCloud::EventManagement::Event->new_from_api($body)->store;

        if ($target_groups) {
            for my $target_group ( @{$target_groups} ) {
                Koha::LMSCloud::EventManagement::Event::TargetGroup::Fee->new(
                    {   event_id        => $event->id,
                        target_group_id => $target_group->{'id'},
                        selected        => $target_group->{'selected'},
                        fee             => $target_group->{'fee'} // 0
                    }
                )->store;
            }
        }

        $event->discard_changes;
        my $event_target_group_fees =
            Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees->search( { event_id => $event->id }, { columns => [ 'target_group_id', 'selected', 'fee' ] } );

        return $c->render( status => 200, openapi => { %{ $event->unblessed }, target_groups => $event_target_group_fees->as_list } || {} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
