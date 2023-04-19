package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Events;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';
use Try::Tiny;

use Koha::Plugin::Com::LMSCloud::EventManagement;
use Koha::LMSCloud::EventManagement::Event;
use Koha::LMSCloud::EventManagement::Events;
use Koha::LMSCloud::EventManagement::Event::TargetGroup::Fee;
use Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees;

our $VERSION = '1.0.0';

my $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;

sub list {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $events_set = Koha::LMSCloud::EventManagement::Events->new;
        my $events     = $c->objects->search_rs($events_set);

        my $response = [];
        while ( my $event = $events->next ) {
            my $event = $event->unblessed;

            my $event_target_group_fees =
                Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees->search( { event_id => $event->{id} }, { columns => [ 'target_group_id', 'selected', 'fee' ] } );
            $event->{'target_groups'} = $event_target_group_fees->as_list;

            push @{$response}, $event;
        }

        return $c->render( status => 200, openapi => $response || [] );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub add {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $body = $c->validation->param('body');

        my $target_groups = delete $body->{'target_groups'};
        my $event         = Koha::LMSCloud::EventManagement::Event->new_from_api($body)->store;

        if ($target_groups) {
            for my $target_group ( @{$target_groups} ) {
                Koha::LMSCloud::EventManagement::Event::TargetGroup::Fee->new(
                    {   event_id        => $event->id,
                        target_group_id => $target_group->{'id'},
                        selected        => $target_group->{'selected'},
                        fee             => $target_group->{'fee'}
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
