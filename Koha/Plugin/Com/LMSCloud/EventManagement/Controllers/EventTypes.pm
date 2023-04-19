package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::EventTypes;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';
use Try::Tiny;

use Koha::Plugin::Com::LMSCloud::EventManagement;
use Koha::LMSCloud::EventManagement::EventType;
use Koha::LMSCloud::EventManagement::EventTypes;
use Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fee;
use Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fees;

our $VERSION = '1.0.0';

my $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;

sub list {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $event_types_set = Koha::LMSCloud::EventManagement::EventTypes->new;
        my $event_types     = $c->objects->search($event_types_set);

        foreach my $event_type ( @{$event_types} ) {
            my $event_type_target_group_fees = Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fees->search( { event_type_id => $event_type->{id} },
                { columns => [ 'target_group_id', 'selected', 'fee' ] } );
            $event_type->{'target_groups'} = $event_type_target_group_fees->as_list;
        }

        return $c->render( status => 200, openapi => $event_types || [] );
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
        my $event_type    = Koha::LMSCloud::EventManagement::EventType->new_from_api($body)->store;

        if ($target_groups) {
            for my $target_group ( @{$target_groups} ) {
                Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fee->new(
                    {   event_type_id   => $event_type->id,
                        target_group_id => $target_group->{'id'},
                        selected        => $target_group->{'selected'},
                        fee             => $target_group->{'fee'}
                    }
                )->store;
            }
        }

        $event_type->discard_changes;
        my $event_type_target_group_fees =
            Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fees->search( { event_type_id => $event_type->id }, { columns => [ 'target_group_id', 'selected', 'fee' ] } );

        return $c->render( status => 200, openapi => { %{ $event_type->unblessed }, target_groups => $event_type_target_group_fees->as_list || [] } || {} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
