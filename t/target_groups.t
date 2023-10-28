#!/usr/bin/env perl

use Modern::Perl;

use FindBin qw($Bin);
use File::Basename;

use Test::More tests => 1;
use Test::Mojo;

use t::lib::TestBuilder;
use t::lib::Mocks;

use Koha::Database;

use lib "$Bin/../lib";

use Koha::LMSCloud::EventManagement::TargetGroups;
use Koha::LMSCloud::EventManagement::Locations;
use Koha::LMSCloud::EventManagement::EventTypes;
use Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fees;
use Koha::LMSCloud::EventManagement::Events;
use Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees;

my $schema  = Koha::Database->new->schema;
my $builder = t::lib::TestBuilder->new;

my $t = Test::Mojo->new('Koha::REST::V1');
t::lib::Mocks::mock_preference( 'RESTBasicAuth', 1 );

subtest 'list() tests' => sub {

    plan tests => 6;

    $schema->storage->txn_begin;

    my $librarian = $builder->build_object(
        {
            class => 'Koha::Patrons',
            value => { flags => 536870911 }
        }
    );

    my $password = 'thePassword123';
    $librarian->set_password( { password => $password, skip_validation => 1 } );
    my $userid = $librarian->userid;

    $t->get_ok("//$userid:$password@/api/v1/contrib/eventmanagement/target_groups")->status_is(200)->json_is( [] );

    my $target_groups =
        [ map { $builder->build_object( { class => 'Koha::LMSCloud::EventManagement::TargetGroups' } ) } 1 .. 5 ];
    my $size = scalar @{$target_groups};

    $t->get_ok("//$userid:$password@/api/v1/contrib/eventmanagement/target_groups")->status_is(200);
    my $response = $t->tx->res->json;

    is @{$response}, $size, 'initialized target groups and response have same size';

    $schema->storage->txn_rollback;
};

