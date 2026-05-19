#!/usr/bin/env perl

use Modern::Perl;

use FindBin qw($Bin);

use Test::More tests => 9;
use Test::Mojo;

use t::lib::TestBuilder;
use t::lib::Mocks;

use Koha::Database;

use lib "$Bin/../Koha/Plugin/Com/LMSCloud/EventManagement/lib";

# Load the plugin first — its BEGIN block registers schema classes and forces
# a new schema connection (Bug 38384). This must happen before txn_begin.
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

# Public booking endpoints are mounted under the public namespace and accept
# anonymous traffic — we only authenticate when the test exercises a path that
# specifically requires a patron (mine, household, authenticated-cancel).
my $public_url = '/api/v1/contrib/eventmanagement';

sub _build_event {
    my ($args) = @_;

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
                event_type        => $et->id,
                location          => $loc->id,
                max_participants  => $args->{max_participants}  // 10,
                status            => $args->{status}            // 'confirmed',
                open_registration => $args->{open_registration} // 1,
            }
        }
    );

    # Wire the target group as offered with the given fee.
    $builder->build(
        {   source => 'KohaPluginComLmscloudEventmanagementETgFee',
            value  => {
                event_id        => $event->id,
                target_group_id => $tg->id,
                selected        => 1,
                fee             => $args->{fee} // 0,
            }
        }
    );

    return { event => $event, target_group => $tg, location => $loc };
}

subtest 'add() authenticated free booking' => sub {

    plan tests => 8;

    $schema->storage->txn_begin;

    my $fix = _build_event( { fee => 0 } );

    $t->post_ok(
        "//$userid:$password\@$public_url/public/bookings" => json => {
            event_id  => $fix->{event}->id,
            attendees => [
                {   name            => 'Test Attendee',
                    target_group_id => $fix->{target_group}->id,
                    borrowernumber  => $patron->borrowernumber,
                },
            ],
        }
    )->status_is(201);
    diag $t->tx->res->body if $t->tx->res->code != 201;

    my $resp = $t->tx->res->json;
    ok( $resp->{id},                'booking id returned' );
    is( $resp->{event_id},          $fix->{event}->id, 'event_id matches' );
    ok( !exists $resp->{confirmation_token},
        'confirmation_token never leaked in response' );
    is( scalar @{ $resp->{attendees} }, 1, 'one attendee returned' );
    is( $resp->{attendees}->[0]->{status}, 'pending', 'attendee starts pending' );
    is( $resp->{attendees}->[0]->{fee_at_booking} + 0,
        0, 'fee snapshot is zero for free target group' );

    $schema->storage->txn_rollback;
};

subtest 'add() anonymous free booking' => sub {

    plan tests => 5;

    $schema->storage->txn_begin;

    my $fix = _build_event( { fee => 0, open_registration => 1 } );

    $t->post_ok(
        "$public_url/public/bookings" => json => {
            event_id  => $fix->{event}->id,
            booker    => { name => 'Anon Smith', email => 'a@example.org' },
            attendees => [
                {   name            => 'Anon Smith',
                    target_group_id => $fix->{target_group}->id,
                },
            ],
        }
    )->status_is(201);
    diag $t->tx->res->body if $t->tx->res->code != 201;

    my $resp = $t->tx->res->json;
    is( $resp->{booker_name},  'Anon Smith',    'booker_name persisted' );
    is( $resp->{booker_email}, 'a@example.org', 'booker_email persisted' );
    ok( !$resp->{booker_borrowernumber},
        'no borrowernumber on anonymous booking' );

    $schema->storage->txn_rollback;
};

subtest 'add() error contracts' => sub {

    plan tests => 14;

    $schema->storage->txn_begin;

    my $fix      = _build_event( { fee => 0 } );
    my $paid_fix = _build_event( { fee => 5 } );
    my $closed_fix
        = _build_event( { fee => 0, open_registration => 0 } );
    my $canceled_fix
        = _build_event( { fee => 0, status => 'canceled' } );

    # Missing event_id
    $t->post_ok(
        "$public_url/public/bookings" => json => {
            attendees => [
                {   name            => 'X',
                    target_group_id => $fix->{target_group}->id,
                },
            ],
        }
    )->status_is(400);

    # Empty attendees
    $t->post_ok(
        "$public_url/public/bookings" => json => {
            event_id  => $fix->{event}->id,
            booker    => { name => 'A', email => 'a@x.y' },
            attendees => [],
        }
    )->status_is(400);

    # Event not found
    $t->post_ok(
        "$public_url/public/bookings" => json => {
            event_id  => 99_999_999,
            booker    => { name => 'A', email => 'a@x.y' },
            attendees => [
                {   name            => 'X',
                    target_group_id => $fix->{target_group}->id,
                },
            ],
        }
    )->status_is(404);

    # Event canceled
    $t->post_ok(
        "$public_url/public/bookings" => json => {
            event_id  => $canceled_fix->{event}->id,
            booker    => { name => 'A', email => 'a@x.y' },
            attendees => [
                {   name            => 'X',
                    target_group_id => $canceled_fix->{target_group}->id,
                },
            ],
        }
    )->status_is(409);

    # Anonymous + paid event
    $t->post_ok(
        "$public_url/public/bookings" => json => {
            event_id  => $paid_fix->{event}->id,
            booker    => { name => 'A', email => 'a@x.y' },
            attendees => [
                {   name            => 'X',
                    target_group_id => $paid_fix->{target_group}->id,
                },
            ],
        }
    )->status_is(403);

    # Anonymous on event without open_registration
    $t->post_ok(
        "$public_url/public/bookings" => json => {
            event_id  => $closed_fix->{event}->id,
            booker    => { name => 'A', email => 'a@x.y' },
            attendees => [
                {   name            => 'X',
                    target_group_id => $closed_fix->{target_group}->id,
                },
            ],
        }
    )->status_is(403);

    # Target group not offered on this event
    my $other_tg = $builder->build_object(
        { class => 'Koha::LMSCloud::EventManagement::TargetGroups' } );
    $t->post_ok(
        "//$userid:$password\@$public_url/public/bookings" => json => {
            event_id  => $fix->{event}->id,
            attendees => [
                {   name            => 'X',
                    target_group_id => $other_tg->id,
                    borrowernumber  => $patron->borrowernumber,
                },
            ],
        }
    )->status_is(422);

    $schema->storage->txn_rollback;
};

subtest 'confirm() flips pending → confirmed' => sub {

    plan tests => 4;

    $schema->storage->txn_begin;

    my $fix = _build_event( { fee => 0 } );

    # Create a booking directly via the resultset so we have the token in
    # hand without parsing it out of a letter.
    my $booking
        = Koha::LMSCloud::EventManagement::Bookings->new->create_with_attendees(
        {   event_id  => $fix->{event}->id,
            booker    => { borrowernumber => $patron->borrowernumber },
            attendees => [
                {   borrowernumber  => $patron->borrowernumber,
                    name            => 'Test',
                    target_group_id => $fix->{target_group}->id,
                },
            ],
        }
        );

    my $token = $booking->confirmation_token;

    $t->post_ok("$public_url/public/bookings/confirm/$token")
      ->status_is(200);

    $booking->discard_changes;
    ok( defined $booking->confirmed_at, 'confirmed_at set after confirm' );

    my $attendee = $booking->attendees->next;
    is( $attendee->status, 'confirmed',
        'pending attendee flipped to confirmed' );

    $schema->storage->txn_rollback;
};

subtest 'confirm() rejects unknown token' => sub {

    plan tests => 2;

    $schema->storage->txn_begin;

    $t->post_ok("$public_url/public/bookings/confirm/deadbeef")
      ->status_is(404);

    $schema->storage->txn_rollback;
};

subtest 'cancel() by booker patron' => sub {

    plan tests => 3;

    $schema->storage->txn_begin;

    my $fix = _build_event( { fee => 0 } );

    my $booking
        = Koha::LMSCloud::EventManagement::Bookings->new->create_with_attendees(
        {   event_id  => $fix->{event}->id,
            booker    => { borrowernumber => $patron->borrowernumber },
            attendees => [
                {   borrowernumber  => $patron->borrowernumber,
                    name            => 'Test',
                    target_group_id => $fix->{target_group}->id,
                },
            ],
        }
        );

    $t->post_ok(
        "//$userid:$password\@$public_url/public/bookings/"
            . $booking->id
            . '/cancel' => json => {}
    )->status_is(200);
    diag 'cancel response: ' . $t->tx->res->body if $t->tx->res->code != 200;

    $booking->discard_changes;
    my $attendee = $booking->attendees->next;
    is( $attendee->status, 'canceled', 'attendee canceled' );

    $schema->storage->txn_rollback;
};

subtest 'cancel() via management token (anonymous)' => sub {

    plan tests => 4;

    $schema->storage->txn_begin;

    my $fix = _build_event( { fee => 0, open_registration => 1 } );

    my $booking
        = Koha::LMSCloud::EventManagement::Bookings->new->create_with_attendees(
        {   event_id  => $fix->{event}->id,
            booker    => { name => 'Anon', email => 'anon@example.org' },
            attendees => [
                {   name            => 'Anon',
                    target_group_id => $fix->{target_group}->id,
                },
            ],
        }
        );
    my $token = $booking->confirmation_token;

    $t->post_ok(
        "$public_url/public/bookings/" . $booking->id . '/cancel' => json => {
            token => $token,
        }
    )->status_is(200);

    # Wrong token should be rejected
    my $booking2
        = Koha::LMSCloud::EventManagement::Bookings->new->create_with_attendees(
        {   event_id  => $fix->{event}->id,
            booker    => { name => 'Anon', email => 'anon@example.org' },
            attendees => [
                {   name            => 'Anon',
                    target_group_id => $fix->{target_group}->id,
                },
            ],
        }
        );
    $t->post_ok(
        "$public_url/public/bookings/" . $booking2->id . '/cancel' => json => {
            token => 'wrong-token',
        }
    )->status_is(403);

    $schema->storage->txn_rollback;
};

subtest 'list() mine requires auth' => sub {

    plan tests => 4;

    $schema->storage->txn_begin;

    $t->get_ok("$public_url/public/bookings/mine")->status_is(401);

    my $fix = _build_event( { fee => 0 } );
    Koha::LMSCloud::EventManagement::Bookings->new->create_with_attendees(
        {   event_id  => $fix->{event}->id,
            booker    => { borrowernumber => $patron->borrowernumber },
            attendees => [
                {   borrowernumber  => $patron->borrowernumber,
                    name            => 'Test',
                    target_group_id => $fix->{target_group}->id,
                },
            ],
        }
    );

    $t->get_ok("//$userid:$password\@$public_url/public/bookings/mine")
      ->status_is(200);

    $schema->storage->txn_rollback;
};

subtest 'household() returns roster for authenticated patron' => sub {

    plan tests => 5;

    $schema->storage->txn_begin;

    my $fix = _build_event( { fee => 0 } );

    # Unauthenticated → 401
    $t->get_ok(
        "$public_url/public/bookings/household?event_id="
            . $fix->{event}->id
    )->status_is(401);

    $t->get_ok(
        "//$userid:$password\@$public_url/public/bookings/household?event_id="
            . $fix->{event}->id
    )->status_is(200);

    my $resp = $t->tx->res->json;
    isa_ok( $resp, 'ARRAY', 'household response is an array' );

    $schema->storage->txn_rollback;
};
