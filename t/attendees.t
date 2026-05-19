#!/usr/bin/env perl

use Modern::Perl;

use FindBin qw($Bin);

use Test::More tests => 4;
use Test::Mojo;

use t::lib::TestBuilder;
use t::lib::Mocks;

use Koha::Database;

use lib "$Bin/../Koha/Plugin/Com/LMSCloud/EventManagement/lib";

use Koha::Plugin::Com::LMSCloud::EventManagement;

use Koha::LMSCloud::EventManagement::Bookings;

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

sub _build_event_with_booking {
    my $loc = $builder->build_object(
        { class => 'Koha::LMSCloud::EventManagement::Locations' } );
    my $et = $builder->build_object(
        {   class => 'Koha::LMSCloud::EventManagement::EventTypes',
            value => { location => $loc->id }
        }
    );
    my $tg = $builder->build_object(
        { class => 'Koha::LMSCloud::EventManagement::TargetGroups' } );
    my $event = $builder->build_object(
        {   class => 'Koha::LMSCloud::EventManagement::Events',
            value => {
                event_type       => $et->id,
                location         => $loc->id,
                max_participants => 10,
                status           => 'confirmed',
            }
        }
    );
    $builder->build(
        {   source => 'KohaPluginComLmscloudEventmanagementETgFee',
            value  => {
                event_id        => $event->id,
                target_group_id => $tg->id,
                selected        => 1,
                fee             => 0,
            }
        }
    );

    my $booking
        = Koha::LMSCloud::EventManagement::Bookings->new->create_with_attendees(
        {   event_id  => $event->id,
            booker    => { borrowernumber => $patron->borrowernumber },
            attendees => [
                {   borrowernumber  => $patron->borrowernumber,
                    name            => 'Test',
                    target_group_id => $tg->id,
                },
            ],
        }
        );

    return { event => $event, target_group => $tg, booking => $booking };
}

subtest 'list() attendees for event' => sub {

    plan tests => 4;

    $schema->storage->txn_begin;

    my $fix = _build_event_with_booking();

    $t->get_ok( "$base_url/events/" . $fix->{event}->id . '/attendees' )
      ->status_is(200);

    my $resp = $t->tx->res->json;
    isa_ok( $resp, 'ARRAY', 'attendee list is an array' );
    is( scalar @{$resp}, 1, 'one attendee for the new booking' );

    $schema->storage->txn_rollback;
};

subtest 'list() with status filter' => sub {

    plan tests => 5;

    $schema->storage->txn_begin;

    my $fix = _build_event_with_booking();

    $t->get_ok(
        "$base_url/events/" . $fix->{event}->id . '/attendees?status=pending' )
      ->status_is(200);
    is( scalar @{ $t->tx->res->json },
        1, 'pending filter returns the pending attendee' );

    $t->get_ok(
              "$base_url/events/"
            . $fix->{event}->id
            . '/attendees?status=confirmed' );
    is( scalar @{ $t->tx->res->json },
        0, 'confirmed filter returns no rows yet' );

    $schema->storage->txn_rollback;
};

subtest 'list() 404 for missing event' => sub {

    plan tests => 2;

    $schema->storage->txn_begin;

    $t->get_ok("$base_url/events/99999999/attendees")->status_is(404);

    $schema->storage->txn_rollback;
};

subtest 'update() walks the state machine' => sub {

    plan tests => 10;

    $schema->storage->txn_begin;

    my $fix      = _build_event_with_booking();
    my $attendee = $fix->{booking}->attendees->next;

    # pending → confirmed (valid)
    $t->patch_ok(
        "$base_url/attendees/" . $attendee->id => json => {
            status => 'confirmed',
        }
    )->status_is(200);
    $attendee->discard_changes;
    is( $attendee->status, 'confirmed', 'transitioned to confirmed' );

    # confirmed → attended (valid)
    $t->patch_ok(
        "$base_url/attendees/" . $attendee->id => json => {
            status => 'attended',
        }
    )->status_is(200);
    $attendee->discard_changes;
    is( $attendee->status, 'attended', 'transitioned to attended' );

    # attended → confirmed (invalid, terminal)
    $t->patch_ok(
        "$base_url/attendees/" . $attendee->id => json => {
            status => 'confirmed',
        }
    )->status_is(409);

    # 404 for missing attendee
    $t->patch_ok(
        "$base_url/attendees/99999999" => json => {
            status => 'confirmed',
        }
    )->status_is(404);

    $schema->storage->txn_rollback;
};
