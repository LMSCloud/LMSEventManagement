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

use Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fee;

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

    plan tests => 8;

    $schema->storage->txn_begin;

    $t->get_ok("$base_url/event_types")->status_is(200)->json_is( [] );

    # Create target groups, location, and an event type with fees
    my $tg1 = $builder->build_object( { class => 'Koha::LMSCloud::EventManagement::TargetGroups' } );
    my $tg2 = $builder->build_object( { class => 'Koha::LMSCloud::EventManagement::TargetGroups' } );
    my $loc = $builder->build_object( { class => 'Koha::LMSCloud::EventManagement::Locations' } );

    my $et = $builder->build_object(
        {
            class => 'Koha::LMSCloud::EventManagement::EventTypes',
            value => { location => $loc->id }
        }
    );

    Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fee->new(
        {
            event_type_id   => $et->id,
            target_group_id => $tg1->id,
            selected        => 1,
            fee             => 5.00,
        }
    )->store;

    $t->get_ok("$base_url/event_types")->status_is(200);
    my $response = $t->tx->res->json;

    is( scalar @{$response}, 1, 'one event type returned' );

    my $returned_et = $response->[0];
    is( $returned_et->{name}, $et->name, 'event type name matches' );
    ok( exists $returned_et->{target_groups}, 'target_groups key present in response' );

    $schema->storage->txn_rollback;
};

subtest 'add() valid tests' => sub {

    plan tests => 6;

    $schema->storage->txn_begin;

    my $loc = $builder->build_object( { class => 'Koha::LMSCloud::EventManagement::Locations' } );
    my $tg  = $builder->build_object( { class => 'Koha::LMSCloud::EventManagement::TargetGroups' } );

    $t->post_ok(
        "$base_url/event_types" => json => {
            name             => 'Workshop',
            min_age          => 6,
            max_age          => 99,
            max_participants => 30,
            location         => $loc->id,
            description      => 'A hands-on workshop',
            image            => 'placeholder.png',
            target_groups    => [
                { id => $tg->id, selected => \1, fee => 10.00 },
            ],
        }
    )->status_is(200);
    diag $t->tx->res->body if $t->tx->res->code != 200;

    my $response = $t->tx->res->json;
    is( $response->{name}, 'Workshop', 'name matches' );
    ok( $response->{id}, 'id is set' );
    ok( exists $response->{target_groups}, 'target_groups present in response' );
    is( scalar @{ $response->{target_groups} }, 1, 'one target group fee returned' );

    $schema->storage->txn_rollback;
};

subtest 'add() invalid tests' => sub {

    plan tests => 4;

    $schema->storage->txn_begin;

    my $tg = $builder->build_object( { class => 'Koha::LMSCloud::EventManagement::TargetGroups' } );

    # No selected target groups
    $t->post_ok(
        "$base_url/event_types" => json => {
            name          => 'Invalid Workshop',
            target_groups => [
                { id => $tg->id, selected => \0, fee => 0 },
            ],
        }
    )->status_is(400);

    # max_age out of range
    $t->post_ok(
        "$base_url/event_types" => json => {
            name          => 'Out of Range',
            max_age       => 300,
            target_groups => [
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

    # Delete existing
    $t->delete_ok( "$base_url/event_types/" . $et->id )
        ->status_is(204);

    # Delete non-existent
    $t->delete_ok("$base_url/event_types/99999999")
        ->status_is(404);

    $schema->storage->txn_rollback;
};
