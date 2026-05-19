#!/usr/bin/env perl

# HouseholdRoster::for_patron — builds the household checklist used by the
# OPAC booking form. Covers the suggested-target-group ranking (tightest
# range wins) and the patron-alone case.

use Modern::Perl;

use DateTime;
use FindBin qw($Bin);

use Test::More tests => 4;

use t::lib::TestBuilder;
use t::lib::Mocks;

use Koha::Database;

use lib "$Bin/../Koha/Plugin/Com/LMSCloud/EventManagement/lib";

use Koha::Plugin::Com::LMSCloud::EventManagement;

use Koha::Plugin::Com::LMSCloud::EventManagement::Adapters::HouseholdRoster;

my $schema  = Koha::Database->new->schema;
my $builder = t::lib::TestBuilder->new;

sub _build_event_with_target_groups {
    my ($target_groups) = @_;

    my $loc = $builder->build_object(
        { class => 'Koha::LMSCloud::EventManagement::Locations' } );
    my $et  = $builder->build_object(
        {   class => 'Koha::LMSCloud::EventManagement::EventTypes',
            value => { location => $loc->id }
        }
    );
    my $event = $builder->build_object(
        {   class => 'Koha::LMSCloud::EventManagement::Events',
            value => {
                event_type => $et->id,
                location   => $loc->id,
                status     => 'confirmed',
            }
        }
    );

    my $tg_ids = [];
    for my $spec ( @{$target_groups} ) {
        my $tg = $builder->build_object(
            {   class => 'Koha::LMSCloud::EventManagement::TargetGroups',
                value => {
                    min_age => $spec->{min_age},
                    max_age => $spec->{max_age},
                    name    => $spec->{name},
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
        push @{$tg_ids}, $tg->id;
    }
    return { event => $event, target_group_ids => $tg_ids };
}

subtest 'for_patron returns the patron alone when no guarantees' => sub {

    plan tests => 3;

    $schema->storage->txn_begin;

    my $fix = _build_event_with_target_groups(
        [ { min_age => 0, max_age => 99, name => 'Anyone' } ] );

    my $patron = $builder->build_object(
        {   class => 'Koha::Patrons',
            value => { dateofbirth => '1990-01-01' }
        }
    );

    my $roster
        = Koha::Plugin::Com::LMSCloud::EventManagement::Adapters::HouseholdRoster
        ->for_patron(
        {   borrowernumber => $patron->borrowernumber,
            event_id       => $fix->{event}->id,
        }
        );

    is( scalar @{$roster}, 1, 'patron-only roster' );
    is( $roster->[0]->{borrowernumber}, $patron->borrowernumber,
        'first entry is the patron' );
    ok( $roster->[0]->{suggested_target_group},
        'suggested target group attached when DOB falls inside range' );

    $schema->storage->txn_rollback;
};

subtest 'tightest-range target group wins for the suggested pick' => sub {

    plan tests => 2;

    $schema->storage->txn_begin;

    # Build two overlapping groups; the patron's age falls inside both,
    # but Kids (5-12) is tighter than Anyone (0-99).
    my $fix = _build_event_with_target_groups(
        [   { min_age => 0, max_age => 99, name => 'Anyone' },
            { min_age => 5, max_age => 12, name => 'Kids' },
        ]
    );

    my $kids_tg_id = $fix->{target_group_ids}->[1];

    my $patron = $builder->build_object(
        {   class => 'Koha::Patrons',
            value => { dateofbirth => _years_ago(8) }
        }
    );

    my $roster
        = Koha::Plugin::Com::LMSCloud::EventManagement::Adapters::HouseholdRoster
        ->for_patron(
        {   borrowernumber => $patron->borrowernumber,
            event_id       => $fix->{event}->id,
        }
        );

    ok( $roster->[0]->{suggested_target_group},
        'suggestion present' );
    is( $roster->[0]->{suggested_target_group}->{id},
        $kids_tg_id, 'tightest range (Kids) wins over Anyone' );

    $schema->storage->txn_rollback;
};

subtest 'no suggestion when age falls outside every offered group' => sub {

    plan tests => 6;

    $schema->storage->txn_begin;

    my $fix = _build_event_with_target_groups(
        [ { min_age => 5, max_age => 12, name => 'Kids' } ] );

    my $patron = $builder->build_object(
        {   class => 'Koha::Patrons',
            value => { dateofbirth => _years_ago(40) }
        }
    );

    my $roster
        = Koha::Plugin::Com::LMSCloud::EventManagement::Adapters::HouseholdRoster
        ->for_patron(
        {   borrowernumber => $patron->borrowernumber,
            event_id       => $fix->{event}->id,
        }
        );

    my $member = $roster->[0];
    ok( !defined $member->{suggested_target_group},
        'no suggestion outside every offered range' );

    # Regression: _suggest_target_group's bare return in list context used
    # to inject an empty list into the hashref, dropping every key after
    # it. Pin the field count to catch a relapse.
    is( scalar keys %{$member}, 5, 'member hash has all five keys' );
    ok( exists $member->{borrowernumber}, 'borrowernumber survives' );
    ok( exists $member->{name},           'name survives' );
    ok( exists $member->{dob},            'dob survives' );
    ok( exists $member->{age},            'age survives' );

    $schema->storage->txn_rollback;
};

subtest 'roster surface contains expected fields' => sub {

    plan tests => 5;

    $schema->storage->txn_begin;

    my $fix = _build_event_with_target_groups(
        [ { min_age => 0, max_age => 99, name => 'Anyone' } ] );

    my $patron = $builder->build_object(
        {   class => 'Koha::Patrons',
            value => { dateofbirth => '1985-06-15' }
        }
    );

    my $roster
        = Koha::Plugin::Com::LMSCloud::EventManagement::Adapters::HouseholdRoster
        ->for_patron(
        {   borrowernumber => $patron->borrowernumber,
            event_id       => $fix->{event}->id,
        }
        );

    my $member = $roster->[0];
    ok( exists $member->{borrowernumber}, 'borrowernumber field present' );
    ok( exists $member->{name},           'name field present' );
    ok( exists $member->{dob},            'dob field present' );
    ok( exists $member->{age},            'age field present' );
    ok( exists $member->{suggested_target_group},
        'suggested_target_group field present' );

    $schema->storage->txn_rollback;
};

sub _years_ago {
    my ($years) = @_;
    my $now = DateTime->now;
    return $now->subtract( years => $years )->ymd;
}
