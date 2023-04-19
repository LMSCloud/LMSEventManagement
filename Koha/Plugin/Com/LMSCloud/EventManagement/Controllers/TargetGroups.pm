package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::TargetGroups;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';
use Try::Tiny;

use Koha::Plugin::Com::LMSCloud::EventManagement;
use Koha::LMSCloud::EventManagement::TargetGroup;
use Koha::LMSCloud::EventManagement::TargetGroups;

our $VERSION = '1.0.0';

my $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;

sub list {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $target_groups_set = Koha::LMSCloud::EventManagement::TargetGroups->new;
        my $target_group      = $c->objects->search($target_groups_set);

        return $c->render( status => 200, openapi => $target_group || [] );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

sub add {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $body = $c->validation->param('body');

        my $target_group = Koha::LMSCloud::EventManagement::TargetGroup->new_from_api($body)->store;

        return $c->render( status => 200, openapi => $target_group->unblessed || {} );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
