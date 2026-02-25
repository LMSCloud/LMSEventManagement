#!/usr/bin/env perl

use Modern::Perl;

use FindBin qw($Bin);
use File::Basename;

use Test::More tests => 5;
use Test::Mojo;

use t::lib::TestBuilder;
use t::lib::Mocks;

use C4::Context  ();
use Koha::Database;

use lib "$Bin/../Koha/Plugin/Com/LMSCloud/EventManagement/lib";

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

my $base_url     = "//$userid:$password@/api/v1/contrib/eventmanagement";
my $plugin_class = 'Koha::Plugin::Com::LMSCloud::EventManagement';

# Instantiate once at file scope — calling ->new inside a transaction triggers
# the migration helper's begin_work which fails with "Already in a transaction".
my $plugin = $plugin_class->new;

sub _cleanup_settings {
    my $dbh = C4::Context->dbh;
    $dbh->do(
        'DELETE FROM plugin_data WHERE plugin_class = ? AND plugin_key NOT LIKE ?',
        undef, $plugin_class, '\\_\\_%'
    );
}

subtest 'list() tests' => sub {

    plan tests => 3;

    $schema->storage->txn_begin;

    _cleanup_settings();

    $t->get_ok("$base_url/settings")->status_is(200);
    my $response = $t->tx->res->json;
    is( ref $response, 'ARRAY', 'response is an array' );

    $schema->storage->txn_rollback;
};

subtest 'add() tests' => sub {

    plan tests => 3;

    $schema->storage->txn_begin;

    _cleanup_settings();

    $t->post_ok(
        "$base_url/settings" => json => [
            { key => 'test_setting_one', value => 'hello' },
            { key => 'test_setting_two', value => 42 },
        ]
    )->status_is(200);
    my $response = $t->tx->res->json;
    is( ref $response, 'ARRAY', 'response is an array of settings' );

    $schema->storage->txn_rollback;
};

subtest 'get() tests' => sub {

    plan tests => 4;

    $schema->storage->txn_begin;

    _cleanup_settings();

    # Store a setting via plugin API
    $plugin->store_data( { 'test_get_key' => '"test_value"' } );

    $t->get_ok("$base_url/settings/test_get_key")->status_is(200);
    my $response = $t->tx->res->json;
    is( $response->{plugin_key}, 'test_get_key', 'plugin_key matches' );
    ok( defined $response->{plugin_value}, 'plugin_value is defined' );

    $schema->storage->txn_rollback;
};

subtest 'update() tests' => sub {

    plan tests => 4;

    $schema->storage->txn_begin;

    _cleanup_settings();

    # Store initial value
    $plugin->store_data( { 'test_update_key' => '"old_value"' } );

    $t->put_ok(
        "$base_url/settings/test_update_key" => json => {
            plugin_value => 'new_value',
        }
    )->status_is(200);
    my $response = $t->tx->res->json;
    is( $response->{plugin_key},   'test_update_key', 'plugin_key matches' );
    is( $response->{plugin_value}, 'new_value',       'plugin_value updated' );

    $schema->storage->txn_rollback;
};

subtest 'delete() tests' => sub {

    plan tests => 6;

    $schema->storage->txn_begin;

    _cleanup_settings();

    # Create setting via the API so it flows through the controller's DB handle
    $t->post_ok(
        "$base_url/settings" => json => [
            { key => 'test_delete_key', value => 'to_delete' },
        ]
    )->status_is(200);

    # Delete existing
    $t->delete_ok("$base_url/settings/test_delete_key")
        ->status_is(204);

    # Delete non-existent
    $t->delete_ok("$base_url/settings/nonexistent_key_xyz")
        ->status_is(404);

    $schema->storage->txn_rollback;
};
