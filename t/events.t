#!/usr/bin/env perl

use Modern::Perl;

use FindBin qw($Bin);
use File::Basename;

use Test::More tests => 4;
use Test::Mojo;

use t::lib::TestBuilder;
use t::lib::Mocks;

use Koha::Database;

use lib "$Bin/../Koha/Plugin/Com/LMSCloud/EventManagement/lib";

# Load the plugin first — its BEGIN block registers schema classes and forces
# a new schema connection (Bug 38384).  This must happen before txn_begin.
use Koha::Plugin::Com::LMSCloud::EventManagement;

my $schema  = Koha::Database->new->schema;
my $builder = t::lib::TestBuilder->new;

my $t = Test::Mojo->new('Koha::REST::V1');
t::lib::Mocks::mock_preference( 'RESTBasicAuth', 1 );

my $password = 'thePassword123';
my $patron   = $builder->build_object(
    {   class => 'Koha::Patrons',
        value => { flags => 536870911 }
    }
);
$patron->set_password( { password => $password, skip_validation => 1 } );
my $userid = $patron->userid;

my $base_url = "//$userid:$password@/api/v1/contrib/eventmanagement";

subtest 'list() tests' => sub {

    plan tests => 7;

    $schema->storage->txn_begin;

    $t->get_ok("$base_url/events")->status_is(200)->json_is( [] );

    # Create prerequisites
    my $loc = $builder->build_object( { class => 'Koha::LMSCloud::EventManagement::Locations' } );
    my $et  = $builder->build_object(
        {
            class => 'Koha::LMSCloud::EventManagement::EventTypes',
            value => { location => $loc->id }
        }
    );

    my $event = $builder->build_object(
        {
            class => 'Koha::LMSCloud::EventManagement::Events',
            value => { event_type => $et->id, location => $loc->id }
        }
    );

    $t->get_ok("$base_url/events")->status_is(200);
    my $response = $t->tx->res->json;

    is( scalar @{$response}, 1, 'one event returned' );
    ok( exists $response->[0]->{target_groups}, 'target_groups key present in response' );

    $schema->storage->txn_rollback;
};

subtest 'add() valid tests' => sub {

    plan tests => 6;

    $schema->storage->txn_begin;

    my $loc = $builder->build_object( { class => 'Koha::LMSCloud::EventManagement::Locations' } );
    my $et  = $builder->build_object(
        {
            class => 'Koha::LMSCloud::EventManagement::EventTypes',
            value => { location => $loc->id }
        }
    );
    my $tg = $builder->build_object( { class => 'Koha::LMSCloud::EventManagement::TargetGroups' } );

    $t->post_ok(
        "$base_url/events" => json => {
            name               => 'Summer Reading',
            event_type         => $et->id,
            location           => $loc->id,
            start_time         => '2025-06-15T10:00:00Z',
            end_time           => '2025-06-15T12:00:00Z',
            registration_start => '2025-06-01T00:00:00Z',
            registration_end   => '2025-06-14T23:59:00Z',
            target_groups      => [
                { id => $tg->id, selected => \1, fee => 5.00 },
            ],
        }
    )->status_is(200);
    diag $t->tx->res->body if $t->tx->res->code != 200;

    my $response = $t->tx->res->json;
    is( $response->{name}, 'Summer Reading', 'name matches' );
    ok( $response->{id}, 'id is set' );
    ok( exists $response->{target_groups}, 'target_groups present in response' );
    is( scalar @{ $response->{target_groups} }, 1, 'one target group fee returned' );

    $schema->storage->txn_rollback;
};

subtest 'add() invalid tests' => sub {

    plan tests => 4;

    $schema->storage->txn_begin;

    my $loc = $builder->build_object( { class => 'Koha::LMSCloud::EventManagement::Locations' } );
    my $et  = $builder->build_object(
        {
            class => 'Koha::LMSCloud::EventManagement::EventTypes',
            value => { location => $loc->id }
        }
    );
    my $tg = $builder->build_object( { class => 'Koha::LMSCloud::EventManagement::TargetGroups' } );

    # No selected target groups
    $t->post_ok(
        "$base_url/events" => json => {
            name          => 'Invalid Event',
            event_type    => $et->id,
            location      => $loc->id,
            target_groups => [
                { id => $tg->id, selected => \0, fee => 0 },
            ],
        }
    )->status_is(400);

    # max_participants out of range
    $t->post_ok(
        "$base_url/events" => json => {
            name             => 'Too Many',
            event_type       => $et->id,
            location         => $loc->id,
            max_participants => 70000,
            target_groups    => [
                { id => $tg->id, selected => \1, fee => 0 },
            ],
        }
    )->status_is(400);

    $schema->storage->txn_rollback;
};

subtest 'delete() tests' => sub {

    plan tests => 4;

    $schema->storage->txn_begin;

    my $loc = $builder->build_object( { class => 'Koha::LMSCloud::EventManagement::Locations' } );
    my $et  = $builder->build_object(
        {
            class => 'Koha::LMSCloud::EventManagement::EventTypes',
            value => { location => $loc->id }
        }
    );
    my $event = $builder->build_object(
        {
            class => 'Koha::LMSCloud::EventManagement::Events',
            value => { event_type => $et->id, location => $loc->id }
        }
    );

    # Delete existing
    $t->delete_ok( "$base_url/events/" . $event->id )
        ->status_is(204);

    # Delete non-existent
    $t->delete_ok("$base_url/events/99999999")
        ->status_is(404);

    $schema->storage->txn_rollback;
};
