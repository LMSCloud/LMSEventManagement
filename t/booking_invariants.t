#!/usr/bin/env perl

# Object-level invariants for the bookings subsystem. These exercise the
# Koha::LMSCloud::EventManagement::Booking{,s} and ::Attendee{,s} classes
# directly, without going through the HTTP controllers, so we can assert
# things like fee-snapshot immutability and the state-machine guards.

use Modern::Perl;

use FindBin qw($Bin);

use Test::More tests => 8;
use Test::Exception;

use t::lib::TestBuilder;
use t::lib::Mocks;

use Koha::Database;

use lib "$Bin/../Koha/Plugin/Com/LMSCloud/EventManagement/lib";

use Koha::Plugin::Com::LMSCloud::EventManagement;

use Koha::LMSCloud::EventManagement::Attendee;
use Koha::LMSCloud::EventManagement::Attendees;
use Koha::LMSCloud::EventManagement::Booking;
use Koha::LMSCloud::EventManagement::Bookings;

my $schema  = Koha::Database->new->schema;
my $builder = t::lib::TestBuilder->new;

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
                max_participants  => $args->{max_participants} // 10,
                status            => 'confirmed',
                open_registration => 1,
            }
        }
    );
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
    my $patron = $builder->build_object( { class => 'Koha::Patrons' } );
    return {
        event        => $event,
        target_group => $tg,
        patron       => $patron,
    };
}

subtest 'fee_at_booking is snapshotted at insert time' => sub {

    plan tests => 2;

    $schema->storage->txn_begin;

    my $fix = _build_event( { fee => 5 } );

    my $booking = Koha::LMSCloud::EventManagement::Bookings->new
        ->create_with_attendees(
        {   event_id => $fix->{event}->id,
            booker   => { borrowernumber => $fix->{patron}->borrowernumber },
            attendees => [
                {   borrowernumber  => $fix->{patron}->borrowernumber,
                    name            => 'Test',
                    target_group_id => $fix->{target_group}->id,
                },
            ],
        }
        );

    my $attendee = $booking->attendees->next;
    is( $attendee->fee_at_booking + 0, 5, 'fee snapshot reflects insert-time fee' );

    # Mutate the live fee row and confirm the attendee snapshot does NOT change.
    my $fee_rs = $schema->resultset('KohaPluginComLmscloudEventmanagementETgFee')->search(
        {   event_id        => $fix->{event}->id,
            target_group_id => $fix->{target_group}->id,
        }
    )->next;
    $fee_rs->update( { fee => 99 } );

    $attendee->discard_changes;
    is( $attendee->fee_at_booking + 0,
        5, 'attendee fee snapshot is immutable after the row updates' );

    $schema->storage->txn_rollback;
};

subtest 'capacity overflow waitlists the excess' => sub {

    plan tests => 3;

    $schema->storage->txn_begin;

    my $fix = _build_event( { max_participants => 1, fee => 0 } );

    my $booking = Koha::LMSCloud::EventManagement::Bookings->new
        ->create_with_attendees(
        {   event_id => $fix->{event}->id,
            booker   => { borrowernumber => $fix->{patron}->borrowernumber },
            attendees => [
                {   borrowernumber  => $fix->{patron}->borrowernumber,
                    name            => 'Within capacity',
                    target_group_id => $fix->{target_group}->id,
                },
                {   name            => 'Overflow',
                    target_group_id => $fix->{target_group}->id,
                },
            ],
        }
        );

    my @attendees = $booking->attendees->search(
        {}, { order_by => { -asc => 'id' } } )->as_list;
    is( scalar @attendees,    2,            'two attendees stored' );
    is( $attendees[0]->status, 'pending',    'first fits as pending' );
    is( $attendees[1]->status, 'waitlisted', 'second waitlisted' );

    $schema->storage->txn_rollback;
};

subtest 'anonymous-must-be-free invariant' => sub {

    plan tests => 1;

    $schema->storage->txn_begin;

    my $fix = _build_event( { fee => 5 } );

    throws_ok {
        Koha::LMSCloud::EventManagement::Bookings->new->create_with_attendees(
            {   event_id  => $fix->{event}->id,
                booker    => { name => 'A', email => 'a@x.y' },
                attendees => [
                    {   name            => 'A',
                        target_group_id => $fix->{target_group}->id,
                    },
                ],
            }
        );
    }
    qr/BOOKING_ANONYMOUS_PAID/,
        'paid anonymous booking croaks with BOOKING_ANONYMOUS_PAID';

    $schema->storage->txn_rollback;
};

subtest 'target group must be offered on the event' => sub {

    plan tests => 1;

    $schema->storage->txn_begin;

    my $fix      = _build_event( { fee => 0 } );
    my $other_tg = $builder->build_object(
        { class => 'Koha::LMSCloud::EventManagement::TargetGroups' } );

    throws_ok {
        Koha::LMSCloud::EventManagement::Bookings->new->create_with_attendees(
            {   event_id => $fix->{event}->id,
                booker => { borrowernumber => $fix->{patron}->borrowernumber },
                attendees => [
                    {   name            => 'A',
                        target_group_id => $other_tg->id,
                    },
                ],
            }
        );
    }
    qr/BOOKING_TARGET_GROUP_NOT_OFFERED/,
        'unknown target group croaks with BOOKING_TARGET_GROUP_NOT_OFFERED';

    $schema->storage->txn_rollback;
};

subtest 'Attendee->transition_to enforces the state machine' => sub {

    plan tests => 4;

    $schema->storage->txn_begin;

    my $fix = _build_event( { fee => 0 } );
    my $booking = Koha::LMSCloud::EventManagement::Bookings->new
        ->create_with_attendees(
        {   event_id => $fix->{event}->id,
            booker   => { borrowernumber => $fix->{patron}->borrowernumber },
            attendees => [
                {   borrowernumber  => $fix->{patron}->borrowernumber,
                    name            => 'T',
                    target_group_id => $fix->{target_group}->id,
                },
            ],
        }
        );
    my $attendee = $booking->attendees->next;

    # Valid: pending → confirmed
    $attendee->transition_to('confirmed');
    is( $attendee->status, 'confirmed', 'pending → confirmed allowed' );

    # Valid: confirmed → attended (terminal)
    $attendee->transition_to('attended');
    is( $attendee->status, 'attended', 'confirmed → attended allowed' );

    # Terminal: attended → anything croaks
    throws_ok { $attendee->transition_to('confirmed') }
    qr/BOOKING_BAD_TRANSITION/, 'attended → confirmed rejected';

    throws_ok { $attendee->transition_to('canceled') }
    qr/BOOKING_BAD_TRANSITION/, 'attended → canceled rejected';

    $schema->storage->txn_rollback;
};

subtest 'cancel() promotes oldest waitlisted in same target group' => sub {

    plan tests => 3;

    $schema->storage->txn_begin;

    my $fix = _build_event( { max_participants => 1, fee => 0 } );

    my $booking1 = Koha::LMSCloud::EventManagement::Bookings->new
        ->create_with_attendees(
        {   event_id => $fix->{event}->id,
            booker   => { borrowernumber => $fix->{patron}->borrowernumber },
            attendees => [
                {   borrowernumber  => $fix->{patron}->borrowernumber,
                    name            => 'First',
                    target_group_id => $fix->{target_group}->id,
                },
            ],
        }
        );

    my $other_patron
        = $builder->build_object( { class => 'Koha::Patrons' } );
    my $booking2 = Koha::LMSCloud::EventManagement::Bookings->new
        ->create_with_attendees(
        {   event_id => $fix->{event}->id,
            booker   => { borrowernumber => $other_patron->borrowernumber },
            attendees => [
                {   borrowernumber  => $other_patron->borrowernumber,
                    name            => 'Second',
                    target_group_id => $fix->{target_group}->id,
                },
            ],
        }
        );

    my $a2 = $booking2->attendees->next;
    is( $a2->status, 'waitlisted', 'second attendee waitlisted' );

    $booking1->cancel;
    $a2->discard_changes;
    is( $a2->status, 'confirmed',
        'waitlisted attendee auto-promoted on cancellation' );

    my $a1 = $booking1->attendees->next;
    is( $a1->status, 'canceled', 'first attendee canceled' );

    $schema->storage->txn_rollback;
};

subtest 'sweep_stale_pending cancels unconfirmed bookings past cutoff' => sub {

    plan tests => 4;

    $schema->storage->txn_begin;

    my $fix = _build_event( { fee => 0 } );

    my $booking = Koha::LMSCloud::EventManagement::Bookings->new
        ->create_with_attendees(
        {   event_id => $fix->{event}->id,
            booker   => { borrowernumber => $fix->{patron}->borrowernumber },
            attendees => [
                {   borrowernumber  => $fix->{patron}->borrowernumber,
                    name            => 'T',
                    target_group_id => $fix->{target_group}->id,
                },
            ],
        }
        );

    # Backdate the row by 48h to fall outside the default 24h cutoff.
    $schema->resultset('KohaPluginComLmscloudEventmanagementEBooking')->find(
        $booking->id )->update( { created_at => \"NOW() - INTERVAL 48 HOUR" } );

    my $count = Koha::LMSCloud::EventManagement::Bookings
        ->sweep_stale_pending( { older_than_hours => 24 } );
    is( $count, 1, 'one stale booking cancelled' );

    my $attendee = $booking->attendees->next;
    is( $attendee->status, 'canceled', 'pending attendee cancelled by sweep' );

    # A second sweep is a no-op now that everything is terminal.
    my $count2 = Koha::LMSCloud::EventManagement::Bookings
        ->sweep_stale_pending( { older_than_hours => 24 } );
    is( $count2, 0, 'second sweep does nothing' );

    # A fresh booking inside the cutoff must be left alone.
    my $fresh_patron
        = $builder->build_object( { class => 'Koha::Patrons' } );
    my $fresh = Koha::LMSCloud::EventManagement::Bookings->new
        ->create_with_attendees(
        {   event_id  => $fix->{event}->id,
            booker    => { borrowernumber => $fresh_patron->borrowernumber },
            attendees => [
                {   borrowernumber  => $fresh_patron->borrowernumber,
                    name            => 'Fresh',
                    target_group_id => $fix->{target_group}->id,
                },
            ],
        }
        );
    Koha::LMSCloud::EventManagement::Bookings->sweep_stale_pending(
        { older_than_hours => 24 } );
    my $fa = $fresh->attendees->next;
    is( $fa->status, 'pending',
        'fresh booking left alone by sweep' );

    $schema->storage->txn_rollback;
};

subtest 'partial unique constraint blocks duplicate active patron rows' => sub {

    plan tests => 1;

    $schema->storage->txn_begin;

    my $fix = _build_event( { fee => 0 } );

    Koha::LMSCloud::EventManagement::Bookings->new->create_with_attendees(
        {   event_id  => $fix->{event}->id,
            booker    => { borrowernumber => $fix->{patron}->borrowernumber },
            attendees => [
                {   borrowernumber  => $fix->{patron}->borrowernumber,
                    name            => 'First',
                    target_group_id => $fix->{target_group}->id,
                },
            ],
        }
    );

    # A second booking for the same patron+event should fail at the DB-level
    # partial unique on active_borrower_key.
    throws_ok {
        Koha::LMSCloud::EventManagement::Bookings->new->create_with_attendees(
            {   event_id  => $fix->{event}->id,
                booker    => { borrowernumber => $fix->{patron}->borrowernumber },
                attendees => [
                    {   borrowernumber  => $fix->{patron}->borrowernumber,
                        name            => 'Second',
                        target_group_id => $fix->{target_group}->id,
                    },
                ],
            }
        );
    }
    qr/uniq_active_borrower|Duplicate|DBIx::Class/i,
        'second active row for same patron rejected by partial unique';

    $schema->storage->txn_rollback;
};
