package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Event;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use C4::Context;
use Try::Tiny;
use JSON;
use SQL::Abstract;

use Koha::Plugin::Com::LMSCloud::EventManagement;
use Koha::LMSCloud::EventManagement::Events;
use Koha::LMSCloud::EventManagement::Event::TargetGroup::Fee;
use Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees;

our $VERSION = '1.0.0';

my $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;

sub get {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $id    = $c->validation->param('id');
        my $event = Koha::LMSCloud::EventManagement::Events->find($id);

        if ( !$event ) {
            return $c->render( status => 404, openapi => { error => 'Event not found' } );
        }

        my $event_target_group_fees =
            Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees->search( { event_id => $id }, { columns => [ 'target_group_id', 'selected', 'fee' ] } );
        return $c->render(
            status  => 200,
            openapi => { %{ $event->unblessed }, target_groups => $event_target_group_fees->as_list } || {}
        );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub update {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $id    = $c->validation->param('id');
        my $body  = $c->validation->param('body');
        my $event = Koha::LMSCloud::EventManagement::Events->find($id);

        if ( !$event ) {
            return $c->render( status => 404, openapi => { error => 'Event not found' } );
        }

        my $target_groups = delete $body->{'target_groups'};

        $event->set_from_api($body);
        $event->store;

        if ($target_groups) {
            Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees->search( { event_id => $id } )->delete;

            for my $target_group ( @{$target_groups} ) {
                Koha::LMSCloud::EventManagement::Event::TargetGroup::Fee->new(
                    {   event_id        => $id,
                        target_group_id => $target_group->{'id'},
                        selected        => $target_group->{'selected'},
                        fee             => $target_group->{'fee'}
                    }
                )->store;
            }
        }

        $event->discard_changes;
        my $event_target_group_fees =
            Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees->search( { event_id => $id }, { columns => [ 'target_group_id', 'selected', 'fee' ] } );

        return $c->render(
            status  => 200,
            openapi => { %{ $event->unblessed }, target_groups => $event_target_group_fees->as_list } || {}
        );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub delete {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $id    = $c->validation->param('id');
        my $event = Koha::LMSCloud::EventManagement::Events->find($id);

        if ( !$event ) {
            return $c->render( status => 404, openapi => { error => 'Event not found' } );
        }

        # delete the entries from the junction table first
        Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees->search( { event_id => $id } )->delete;

        # delete the event
        $event->delete;

        return $c->render( status => 204, openapi => q{} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
