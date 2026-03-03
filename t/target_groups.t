#!/usr/bin/env perl

use Modern::Perl;

use FindBin qw($Bin);
use File::Basename;

use Test::More tests => 5;
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

    plan tests => 5;

    $schema->storage->txn_begin;

    $t->get_ok("$base_url/target_groups?_per_page=-1")->status_is(200);
    my $initial_count = scalar @{ $t->tx->res->json };

    my $target_groups =
        [ map { $builder->build_object( { class => 'Koha::LMSCloud::EventManagement::TargetGroups' } ) } 1 .. 5 ];
    my $size = scalar @{$target_groups};

    $t->get_ok("$base_url/target_groups?_per_page=-1")->status_is(200);
    my $response = $t->tx->res->json;

    is( scalar @{$response}, $initial_count + $size, 'response has correct number of target groups' );

    $schema->storage->txn_rollback;
};

subtest 'add() tests' => sub {

    plan tests => 8;

    $schema->storage->txn_begin;

    # Valid add
    $t->post_ok(
        "$base_url/target_groups" => json => {
            name    => 'Children',
            min_age => 6,
            max_age => 12,
        }
    )->status_is(200);

    my $response = $t->tx->res->json;
    is( $response->{name},    'Children', 'name matches' );
    is( $response->{min_age}, 6,          'min_age matches' );
    is( $response->{max_age}, 12,         'max_age matches' );
    ok( $response->{id}, 'id is set' );

    # Invalid add - age out of range
    $t->post_ok(
        "$base_url/target_groups" => json => {
            name    => 'Invalid Group',
            min_age => 0,
            max_age => 300,
        }
    )->status_is(400);

    $schema->storage->txn_rollback;
};

subtest 'get() tests' => sub {

    plan tests => 4;

    $schema->storage->txn_begin;

    my $target_group = $builder->build_object(
        { class => 'Koha::LMSCloud::EventManagement::TargetGroups' }
    );

    $t->get_ok( "$base_url/target_groups/" . $target_group->id )
        ->status_is(200);

    # Non-existent
    $t->get_ok("$base_url/target_groups/99999999")
        ->status_is(404);

    $schema->storage->txn_rollback;
};

subtest 'update() tests' => sub {

    plan tests => 5;

    $schema->storage->txn_begin;

    my $target_group = $builder->build_object(
        { class => 'Koha::LMSCloud::EventManagement::TargetGroups' }
    );

    # Valid update
    $t->put_ok(
        "$base_url/target_groups/" . $target_group->id => json => {
            name    => 'Teens',
            min_age => 13,
            max_age => 19,
        }
    )->status_is(200)
      ->json_is( '/name' => 'Teens' );

    # max_age out of range -> 400
    $t->put_ok(
        "$base_url/target_groups/" . $target_group->id => json => {
            name    => 'Invalid',
            min_age => 0,
            max_age => 300,
        }
    )->status_is(400);

    $schema->storage->txn_rollback;
};

subtest 'delete() tests' => sub {

    plan tests => 4;

    $schema->storage->txn_begin;

    my $target_group = $builder->build_object(
        { class => 'Koha::LMSCloud::EventManagement::TargetGroups' }
    );

    # Delete existing
    $t->delete_ok( "$base_url/target_groups/" . $target_group->id )
        ->status_is(204);

    # Delete non-existent
    $t->delete_ok("$base_url/target_groups/99999999")
        ->status_is(404);

    $schema->storage->txn_rollback;
};
