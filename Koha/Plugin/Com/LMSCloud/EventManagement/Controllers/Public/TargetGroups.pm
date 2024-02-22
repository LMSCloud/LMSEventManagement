package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Public::TargetGroups;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use Try::Tiny qw( catch try );

use Koha::LMSCloud::EventManagement::TargetGroup  ();
use Koha::LMSCloud::EventManagement::TargetGroups ();

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

1;
