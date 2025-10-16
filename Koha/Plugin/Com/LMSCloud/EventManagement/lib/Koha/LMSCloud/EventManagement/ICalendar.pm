package Koha::LMSCloud::EventManagement::ICalendar;

use Modern::Perl;
use utf8;

use C4::Scrubber;

use Koha::DateUtils qw( dt_from_string );

use Data::ICal;
use Data::ICal::Entry::Event;

=head1 NAME

Koha::LMSCloud::EventManagement::ICalendar - iCalendar/ICS generation for events

=head1 SYNOPSIS

    use Koha::LMSCloud::EventManagement::ICalendar;

    my $ical = Koha::LMSCloud::EventManagement::ICalendar::generate_event_ical($event, $location);

=head1 DESCRIPTION

This module provides iCalendar (ICS) format generation for event management events using Data::ICal.

=head1 FUNCTIONS

=head2 generate_event_ical

Generate iCalendar format for a single event

    my $ical_string = generate_event_ical($event_obj, $location_obj);

Parameters:
  $event - Event object with fields: id, name, description, start_time, end_time, registration_link
  $location - Location object with fields: name, address, link

Returns: String containing iCalendar formatted data

=cut

sub generate_event_ical {
    my ( $event, $location ) = @_;

    my $calendar = Data::ICal->new;

    my $vevent = Data::ICal::Entry::Event->new;

    my $uid = join q{}, 'event-', $event->id, '@lmscloud-eventmanagement';
    $vevent->add_properties( uid => $uid, );

    $vevent->add_properties( summary => $event->name || 'Event', );

    if ( $event->description ) {
        my $scrubber   = C4::Scrubber->new('default');
        my $clean_desc = $scrubber->scrub( $event->description );
        $vevent->add_properties( description => $clean_desc, );
    }

    if ( $event->start_time ) {
        my $start_dt = _parse_mysql_datetime( $event->start_time );
        $vevent->add_properties( dtstart => $start_dt->strftime('%Y%m%dT%H%M%SZ'), );
    }

    if ( $event->end_time ) {
        my $end_dt = _parse_mysql_datetime( $event->end_time );
        $vevent->add_properties( dtend => $end_dt->strftime('%Y%m%dT%H%M%SZ'), );
    }

    if ($location) {
        my $location_parts = [];

        if ( $location->name ) {
            push @{$location_parts}, $location->name;
        }

        if ( $location->street ) {
            my $street_address = $location->street;
            if ( $location->number ) {
                $street_address = join q{ }, $street_address, $location->number;
            }
            push @{$location_parts}, $street_address;
        }

        if ( $location->zip || $location->city ) {
            my $city_line = join q{ }, grep {$_} ( $location->zip, $location->city );
            push @{$location_parts}, $city_line if $city_line;
        }

        if ( $location->country ) {
            push @{$location_parts}, $location->country;
        }

        if ( @{$location_parts} ) {
            $vevent->add_properties( location => join( ', ', @{$location_parts} ), );
        }

        # Add location link as geo or URL if available
        if ( $location->link ) {
            $vevent->add_properties( 'x-location-url' => $location->link, );
        }
    }

    if ( $event->registration_link ) {
        $vevent->add_properties( url => $event->registration_link, );
    }

    $vevent->add_properties( status => 'CONFIRMED', );

    my $now = DateTime->now->strftime('%Y%m%dT%H%M%SZ');
    $vevent->add_properties( dtstamp => $now, );

    $calendar->add_entry($vevent);

    return $calendar->as_string;
}

=head2 _parse_mysql_datetime

Convert MySQL datetime string to DateTime object

=cut

sub _parse_mysql_datetime {
    my ($mysql_dt) = @_;

    return dt_from_string( $mysql_dt, 'sql' );
}

1;
