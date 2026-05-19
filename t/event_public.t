#!/usr/bin/env perl

# Public::Event#get — single-event read used by the OPAC booking page.

use Modern::Perl;

use FindBin qw($Bin);

use Test::More tests => 3;
use Test::Mojo;

use t::lib::TestBuilder;
use t::lib::Mocks;

use Koha::Database;

use lib "$Bin/../Koha/Plugin/Com/LMSCloud/EventManagement/lib";

use Koha::Plugin::Com::LMSCloud::EventManagement;

my $schema  = Koha::Database->new->schema;
my $builder = t::lib::TestBuilder->new;

my $t = Test::Mojo->new('Koha::REST::V1');

my $public_url = '/api/v1/contrib/eventmanagement';

sub _build_event {
    my ($status) = @_;
    my $loc = $builder->build_object(
        { class => 'Koha::LMSCloud::EventManagement::Locations' } );
    my $et  = $builder->build_object(
        {   class => 'Koha::LMSCloud::EventManagement::EventTypes',
            value => { location => $loc->id }
        }
    );
    my $tg = $builder->build_object(
        { class => 'Koha::LMSCloud::EventManagement::TargetGroups' } );
    my $event = $builder->build_object(
        {   class => 'Koha::LMSCloud::EventManagement::Events',
            value => {
                event_type => $et->id,
                location   => $loc->id,
                status     => $status // 'confirmed',
            }
        }
    );
    $builder->build(
        {   source => 'KohaPluginComLmscloudEventmanagementETgFee',
            value  => {
                event_id        => $event->id,
                target_group_id => $tg->id,
                selected        => 1,
                fee             => 3,
            }
        }
    );
    return { event => $event, target_group => $tg };
}

subtest 'get() returns event with target_groups inlined' => sub {

    plan tests => 4;

    $schema->storage->txn_begin;

    my $fix = _build_event();

    $t->get_ok( "$public_url/public/events/" . $fix->{event}->id )
      ->status_is(200);

    my $resp = $t->tx->res->json;
    is( $resp->{id}, $fix->{event}->id, 'event id round-trips' );
    isa_ok( $resp->{target_groups}, 'ARRAY',
        'target_groups inlined as array' );

    $schema->storage->txn_rollback;
};

subtest 'get() 404 for unknown id' => sub {

    plan tests => 2;

    $schema->storage->txn_begin;

    $t->get_ok("$public_url/public/events/99999999")->status_is(404);

    $schema->storage->txn_rollback;
};

subtest 'get() honours opac_hide_pending_events for pending events' => sub {

    plan tests => 6;

    $schema->storage->txn_begin;

    my $fix = _build_event('pending');

    # With the hide flag off, pending events are visible.
    my $plugin = Koha::Plugin::Com::LMSCloud::EventManagement->new;
    $plugin->store_data( { opac_hide_pending_events => 0 } );
    $t->get_ok( "$public_url/public/events/" . $fix->{event}->id )
      ->status_is(200);

    # With it on, pending events return 404.
    $plugin->store_data( { opac_hide_pending_events => 1 } );
    $t->get_ok( "$public_url/public/events/" . $fix->{event}->id )
      ->status_is(404);

    # Confirmed events are still visible regardless.
    my $other = _build_event('confirmed');
    $t->get_ok( "$public_url/public/events/" . $other->{event}->id )
      ->status_is(200);

    # Restore default for other tests.
    $plugin->store_data( { opac_hide_pending_events => 0 } );

    $schema->storage->txn_rollback;
};
