package Koha::Plugin::Com::LMSCloud::EventManagement::Adapters::HouseholdRoster;

use Modern::Perl;
use utf8;

use Carp       qw( croak );
use DateTime   ();
use List::Util qw( min );

use Koha::Database  ();
use Koha::DateUtils qw( dt_from_string );
use Koha::Patrons   ();

=head1 NAME

Koha::Plugin::Com::LMSCloud::EventManagement::Adapters::HouseholdRoster -
build a household roster for the booking form

=head1 DESCRIPTION

Given a logged-in patron and an event, returns the patron plus their
guarantees (e.g. children registered as their dependents in Koha) with a
suggested target group for each, derived from date of birth against the
target groups offered on the event. Used by the booking page to render
the household checklist without making the patron retype known data.

The "suggested" target group is the one with the smallest age range
covering the attendee — when ranges overlap, the more specific group
wins. If no offered target group matches the attendee's age, the
suggestion is undef and the booking UI is expected to either hide the
member or let the booker pick manually.

=head1 API

=head2 for_patron({ borrowernumber => $n, event_id => $e })

Returns an arrayref of household member hashes:

  [
      {
          borrowernumber          => 17,
          name                    => 'Foo Bar',
          dob                     => '1990-01-01',  # ISO; undef if unknown
          age                     => 36,            # undef if unknown
          suggested_target_group  => { id => 3, name => 'Adults' },  # or undef
      },
      ...
  ]

The patron themselves is always the first entry. Guarantees follow in
the order Koha returns them.

=cut

sub for_patron {
    my ( $class, $args ) = @_;

    my $borrowernumber = $args->{borrowernumber} or croak 'borrowernumber required';
    my $event_id       = $args->{event_id}       or croak 'event_id required';

    my $patron = Koha::Patrons->find($borrowernumber);
    croak "patron not found: $borrowernumber" if !$patron;

    my $offered = _offered_target_groups($event_id);
    my $members = [ _build_member( $patron, $offered ) ];

    my $relationships = eval { $patron->guarantee_relationships };
    if ($relationships) {
        while ( my $rel = $relationships->next ) {
            my $guarantee = eval { $rel->guarantee };
            next if !$guarantee;
            push @{$members}, _build_member( $guarantee, $offered );
        }
    }

    return $members;
}

sub _build_member {
    my ( $patron, $offered ) = @_;

    my $dob_iso = _dob_iso( $patron->dateofbirth );
    my $age     = _age_from_dob( $patron->dateofbirth );
    my $name    = join q{ }, grep { defined && $_ ne q{} } ( $patron->firstname, $patron->surname );

    # Force scalar context: _suggest_target_group's bare `return` would
    # otherwise inject an empty list into the hashref and corrupt every
    # field after it.
    my $suggested = _suggest_target_group( $offered, $age );

    return {
        borrowernumber         => $patron->borrowernumber,
        name                   => $name,
        dob                    => $dob_iso,
        age                    => $age,
        suggested_target_group => $suggested,
    };
}

sub _dob_iso {
    my ($dob) = @_;
    return if !$dob;

    if ( ref $dob && $dob->isa('DateTime') ) {
        return $dob->ymd;
    }

    # Already a string; trust it but truncate any trailing time component
    my ($iso) = "$dob" =~ m{^(\d{4}-\d{2}-\d{2})};
    return $iso;
}

sub _age_from_dob {
    my ($dob) = @_;
    return if !$dob;

    my $dob_dt = ref $dob && $dob->isa('DateTime') ? $dob : dt_from_string($dob);
    return if !$dob_dt;

    my $today = DateTime->now;
    my $age   = $today->year - $dob_dt->year;
    if ( $today->month < $dob_dt->month
        || ( $today->month == $dob_dt->month && $today->day < $dob_dt->day ) )
    {
        $age--;
    }
    return $age;
}

sub _offered_target_groups {
    my ($event_id) = @_;

    my $schema = Koha::Database->new->schema;
    my $rs     = $schema->resultset('KohaPluginComLmscloudEventmanagementETgFee')->search(
        {   'me.event_id' => $event_id,
            'me.selected' => 1,
        },
        {   join      => 'target_group',
            '+select' => [ 'target_group.min_age', 'target_group.max_age', 'target_group.name' ],
            '+as'     => [ 'tg_min_age',           'tg_max_age',           'tg_name' ],
        }
    );

    my $offered = [];
    while ( my $row = $rs->next ) {
        push @{$offered},
            {
            id      => $row->target_group_id,
            name    => $row->get_column('tg_name'),
            min_age => $row->get_column('tg_min_age') // 0,
            max_age => $row->get_column('tg_max_age') // 255,
            };
    }
    return $offered;
}

sub _suggest_target_group {
    my ( $offered, $age ) = @_;
    return if !defined $age;
    return if !$offered || !@{$offered};

    my $matches = [ grep { $age >= $_->{min_age} && $age <= $_->{max_age} } @{$offered} ];
    return if !@{$matches};

    # Tightest range wins. Tie-break: lowest min_age, then id (stable).
    my ($pick) = sort { ( $a->{max_age} - $a->{min_age} ) <=> ( $b->{max_age} - $b->{min_age} ) || $a->{min_age} <=> $b->{min_age} || $a->{id} <=> $b->{id} } @{$matches};

    return { id => $pick->{id}, name => $pick->{name} };
}

1;
