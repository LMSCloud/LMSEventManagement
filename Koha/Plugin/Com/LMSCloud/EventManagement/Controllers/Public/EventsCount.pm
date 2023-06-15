package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Public::EventsCount;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';
use Try::Tiny;

use Koha::Plugin::Com::LMSCloud::EventManagement;
use Koha::LMSCloud::EventManagement::Events;

our $VERSION = '1.0.0';

sub get {
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

1;
