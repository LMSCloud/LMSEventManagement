package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::EventType;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use Readonly  ();
use Try::Tiny qw( catch try );

use Locale::Messages qw(
    bind_textdomain_filter
    bindtextdomain
    setlocale
    textdomain
);
use Locale::TextDomain ( 'com.lmscloud.eventmanagement', undef );

use Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees     ();
use Koha::LMSCloud::EventManagement::EventType                    ();
use Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fee  ();
use Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fees ();
use Koha::LMSCloud::EventManagement::EventTypes                   ();
use Koha::Plugin::Com::LMSCloud::Validator                        ();

our $VERSION = '1.0.0';

my $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;

setlocale Locale::Messages::LC_MESSAGES(), q{};
textdomain 'com.lmscloud.eventmanagement';
bind_textdomain_filter 'com.lmscloud.eventmanagement', \&Encode::decode_utf8;
bindtextdomain 'com.lmscloud.eventmanagement' => $self->bundle_path . '/locales/';

Readonly::Scalar my $UPPER_AGE_BOUNDARY          => 255;
Readonly::Scalar my $UPPER_PARTICIPANTS_BOUNDARY => 65_535;

sub _validate {
    my ($args) = @_;

    my $validator = Koha::Plugin::Com::LMSCloud::Validator->new( { schema => $args->{'schema'}, lang => $args->{'lang'} } );
    return $validator->validate();
}

sub get {
    my $c = shift->openapi->valid_input or return;

    return try {
        local $ENV{LANGUAGE}       = $c->validation->param('lang') || 'en';
        local $ENV{OUTPUT_CHARSET} = 'UTF-8';
        my $id         = $c->validation->param('id');
        my $event_type = Koha::LMSCloud::EventManagement::EventTypes->find($id);

        if ( !$event_type ) {
            return $c->render( status => 404, openapi => { error => __('Event type not found') } );
        }

        my $event_type_target_group_fees =
            Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fees->search( { event_type_id => $id }, { columns => [ 'target_group_id', 'selected', 'fee' ] } );
        return $c->render(
            status  => 200,
            openapi => { %{ $event_type->unblessed }, target_groups => $event_type_target_group_fees->as_list || [] } || {}
        );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub update {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $lang = $c->validation->param('lang') || 'en';
        local $ENV{LANGUAGE}       = $lang;
        local $ENV{OUTPUT_CHARSET} = 'UTF-8';
        my $id         = $c->validation->param('id');
        my $body       = $c->validation->param('body');
        my $event_type = Koha::LMSCloud::EventManagement::EventTypes->find($id);

        if ( !$event_type ) {
            return $c->render( status => 404, openapi => { error => __('Event type not found') } );
        }

        my ( $is_valid, $errors ) = _validate(
            {   schema => [
                    {   key     => __('name'),
                        value   => $body->{'name'},
                        type    => 'string',
                        options => { is_alphanumeric => { skip => 1, } },
                    },
                    {   key     => __('max_age'),
                        value   => $body->{'max_age'},
                        type    => 'number',
                        options => {
                            positive => 1,
                            range    => [ 0, $UPPER_AGE_BOUNDARY ],
                        },
                    },
                    {   key     => __('min_age'),
                        value   => $body->{'min_age'},
                        type    => 'number',
                        options => {
                            positive => 1,
                            range    => [ 0, $UPPER_AGE_BOUNDARY ],
                        },
                    },
                    {   key     => __('max_participants'),
                        value   => $body->{'max_participants'},
                        type    => 'number',
                        options => {
                            positive => 1,
                            range    => [ 0, $UPPER_PARTICIPANTS_BOUNDARY ],
                        },
                    },
                    {   key     => __('description'),
                        value   => $body->{'description'},
                        type    => 'string',
                        options => {
                            is_alphanumeric    => { skip => 1, },
                            exceeds_max_length => { TEXT => 1, }
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

        $event_type->set_from_api($body);
        $event_type->store;

        if ($target_groups) {
            Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fees->search( { event_type_id => $id } )->delete;

            for my $target_group ( @{$target_groups} ) {
                Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fee->new(
                    {   event_type_id   => $id,
                        target_group_id => $target_group->{'id'},
                        selected        => $target_group->{'selected'},
                        fee             => $target_group->{'fee'} // 0
                    }
                )->store;
            }
        }

        $event_type->discard_changes;
        my $event_type_target_group_fees =
            Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fees->search( { event_type_id => $id }, { columns => [ 'target_group_id', 'selected', 'fee' ] } );

        return $c->render(
            status  => 200,
            openapi => { %{ $event_type->unblessed }, target_groups => $event_type_target_group_fees->as_list || [] } || {}
        );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub delete {
    my $c = shift->openapi->valid_input or return;

    return try {
        local $ENV{LANGUAGE}       = $c->validation->param('lang') || 'en';
        local $ENV{OUTPUT_CHARSET} = 'UTF-8';
        my $id = $c->validation->param('id');

        # This is a temporary fix for the issue with the delete method on rvs of find calls
        my $event_type = Koha::LMSCloud::EventManagement::EventTypes->search( { id => $id } );

        if ( !$event_type ) {
            return $c->render( status => 404, openapi => { error => __('Event type not found') } );
        }

        # delete associated events
        my $events = Koha::LMSCloud::EventManagement::Events->search( { event_type => $id } );
        while ( my $event = $events->next ) {

            # delete the fees first
            Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees->search( { event_id => $event->id } )->delete;

            $event->delete;
        }

        # delete the entries from the junction table first
        Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fees->search( { event_type_id => $id } )->delete;

        # delete the event
        $event_type->delete;

        return $c->render( status => 204, openapi => q{} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
