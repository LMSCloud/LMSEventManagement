package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Public::EventTypes;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use Try::Tiny qw( catch try );

use Koha::LMSCloud::EventManagement::EventTypes                   ();
use Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fees ();

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

1;
