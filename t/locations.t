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

    $t->get_ok("$base_url/locations?_per_page=-1")->status_is(200);
    my $initial_count = scalar @{ $t->tx->res->json };

    my $locations =
        [ map { $builder->build_object( { class => 'Koha::LMSCloud::EventManagement::Locations' } ) } 1 .. 3 ];
    my $size = scalar @{$locations};

    $t->get_ok("$base_url/locations?_per_page=-1")->status_is(200);
    my $response = $t->tx->res->json;

    is( scalar @{$response}, $initial_count + $size, 'response has correct number of locations' );

    $schema->storage->txn_rollback;
};

subtest 'add() tests' => sub {

    plan tests => 9;

    $schema->storage->txn_begin;

    # Valid add
    $t->post_ok(
        "$base_url/locations" => json => {
            name    => 'Main Library',
            street  => 'Bibliotheksplatz',
            number  => '1',
            city    => 'Leipzig',
            zip     => '04103',
            country => 'Germany',
        }
    )->status_is(200);

    my $response = $t->tx->res->json;
    is( $response->{name},    'Main Library',     'name matches' );
    is( $response->{street},  'Bibliotheksplatz', 'street matches' );
    is( $response->{number},  '1',                'number matches' );
    is( $response->{city},    'Leipzig',          'city matches' );
    is( $response->{zip},     '04103',            'zip matches' );
    is( $response->{country}, 'Germany',          'country matches' );
    ok( $response->{id}, 'id is set' );

    $schema->storage->txn_rollback;
};

subtest 'get() tests' => sub {

    plan tests => 4;

    $schema->storage->txn_begin;

    my $location = $builder->build_object(
        { class => 'Koha::LMSCloud::EventManagement::Locations' }
    );

    $t->get_ok( "$base_url/locations/" . $location->id )
        ->status_is(200);

    # Non-existent
    $t->get_ok("$base_url/locations/99999999")
        ->status_is(404);

    $schema->storage->txn_rollback;
};

subtest 'update() tests' => sub {

    plan tests => 5;

    $schema->storage->txn_begin;

    my $location = $builder->build_object(
        { class => 'Koha::LMSCloud::EventManagement::Locations' }
    );

    # Valid update
    $t->put_ok(
        "$base_url/locations/" . $location->id => json => {
            name    => 'Updated Library',
            street  => 'Neue Strasse',
            number  => '42',
            city    => 'Berlin',
            zip     => '10115',
            country => 'Germany',
        }
    )->status_is(200)
      ->json_is( '/name' => 'Updated Library' );

    # Non-existent
    $t->put_ok("$base_url/locations/99999999" => json => {
        name    => 'Ghost',
        street  => 'Nowhere',
        number  => '0',
        city    => 'Void',
        zip     => '00000',
        country => 'None',
    } )->status_is(404);

    $schema->storage->txn_rollback;
};

subtest 'delete() tests' => sub {

    plan tests => 4;

    $schema->storage->txn_begin;

    my $location = $builder->build_object(
        { class => 'Koha::LMSCloud::EventManagement::Locations' }
    );

    # Delete existing
    $t->delete_ok( "$base_url/locations/" . $location->id )
        ->status_is(204);

    # Delete non-existent
    $t->delete_ok("$base_url/locations/99999999")
        ->status_is(404);

    $schema->storage->txn_rollback;
};
