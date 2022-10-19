#!/usr/bin/perl
#
# Copyright 2017 Marywood University
#
# This file is not part of Koha.
#
# Koha is free software; you can redistribute it and/or modify it
# under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 3 of the License, or
# (at your option) any later version.
#
# Koha is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Koha; if not, see <http://www.gnu.org/licenses>.
use Modern::Perl;
use utf8;
use 5.032;

our $VERSION = '1.0.0';

use Carp;
use C4::Context;
use C4::Output;
use C4::Auth;
use C4::Languages;
use Koha::Email;
use Mail::Sendmail;
use MIME::QuotedPrint;
use MIME::Base64;
use Koha::Patrons;
use Koha::Patron::Category;
use Koha::Patron::Categories;
use Koha::DateUtils;
use Cwd qw( abs_path );
use File::Basename qw( dirname );
use POSIX 'strftime';
use POSIX 'floor';
use DateTime;
use English qw(-no_match_vars);

use Koha::UploadedFiles;

use CGI qw ( -utf8 );

use Locale::Messages;
Locale::Messages->select_package('gettext_pp');

use Locale::Messages qw(:locale_h :libintl_h);

no if ( $PERL_VERSION >= 5.018 ), 'warnings' => 'experimental';

my $pluginDir     = dirname( abs_path($PROGRAM_NAME) );
my $template_name = $pluginDir . '/events-grid.tt';

my $cgi = CGI->new;

# initial value -- calendar is displayed while $op is undef
# otherwise one of the form pages is displayed
my $op = $cgi->param('op');

my ( $template, $borrowernumber, $cookie ) = get_template_and_user(
    {   template_name   => $template_name,
        query           => $cgi,
        type            => 'opac',
        authnotrequired => 1,
        is_plugin       => 1,
    }
);

$template->param(
    language => C4::Languages::getlanguage($cgi) || 'en',
    mbf_path => abs_path('../translations')
);

if ( !( defined $op ) ) {

    my $used_target_groups = get_used_target_groups();
    my $used_event_types   = get_used_event_types();
    my $used_branches      = get_used_branches();
    my $events             = get_events();

    $template->param(
        plugin_dir         => $pluginDir,
        op                 => $op,
        events             => $events,
        used_target_groups => $used_target_groups,
        used_event_types   => $used_event_types,
        used_branches      => $used_branches,
    );
}
elsif ( $op eq 'detail' ) {

    my $id    = $cgi->param('id');
    my $event = get_event($id);

    $template->param(
        plugin_dir => $pluginDir,
        op         => $op,
        event      => $event,
    );
}

sub get_used_target_groups {

    my $events_table        = 'koha_plugin_com_lmscloud_eventmanagement_events';
    my $target_groups_table = 'koha_plugin_com_lmscloud_eventmanagement_target_groups';

    my $query = <<~"QUERY";
		SELECT events.target_group, target_groups.name, count(*) AS count  
		FROM $events_table events, $target_groups_table target_groups 
		WHERE events.target_group = target_groups.id
		GROUP BY events.target_group, target_groups.name
	QUERY

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();

    my @target_groups;
    while ( my $row = $sth->fetchrow_hashref() ) {
        push @target_groups, $row;
    }

    return \@target_groups;
}

sub get_used_event_types {

    my $events_table      = 'koha_plugin_com_lmscloud_eventmanagement_events';
    my $event_types_table = 'koha_plugin_com_lmscloud_eventmanagement_event_types';

    my $query = <<~"QUERY";
		SELECT events.event_type, event_types.name, count(*) AS count 
		FROM $events_table events, $event_types_table event_types 
		WHERE events.event_type = event_types.id
		GROUP BY events.event_type, event_types.name
	QUERY

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();

    my @event_types;
    while ( my $row = $sth->fetchrow_hashref() ) {
        push @event_types, $row;
    }

    return \@event_types;
}

sub get_used_branches {

    my $events_table = 'koha_plugin_com_lmscloud_eventmanagement_events';

    my $query = <<~"QUERY";
		SELECT events.branch, branchname, count(*) AS count 
		FROM $events_table events, branches b 
		WHERE events.branch = b.branchcode
		GROUP BY events.branch, branchname
	QUERY

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();

    my @branches;
    while ( my $row = $sth->fetchrow_hashref() ) {
        push @branches, $row;
    }

    return \@branches;
}

sub get_events {

    my $events_table        = 'koha_plugin_com_lmscloud_eventmanagement_events';
    my $event_types_table   = 'koha_plugin_com_lmscloud_eventmanagement_event_types';
    my $target_groups_table = 'koha_plugin_com_lmscloud_eventmanagement_target_groups';

    my $query = <<~"QUERY";
		SELECT events.*, branchname, target_groups.name, event_types.name 
		FROM $events_table AS events
		LEFT JOIN branches AS b ON events.branch = b.branchcode 
		LEFT JOIN $target_groups_table AS target_groups ON events.target_group = target_groups.id 
		LEFT JOIN $event_types_table AS event_types ON events.event_type = event_types.id
	QUERY

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();

    my @events;
    while ( my $row = $sth->fetchrow_hashref() ) {
        if ( defined $row->{'image'} ) {
            my $rec      = Koha::UploadedFiles->find( $row->{'image'} );
            my $srcimage = $rec->hashvalue . '_' . $rec->filename();

            $row->{'image'} = $srcimage;

        }
        else {
            $row->{'image'} = q{};
        }

        push @events, $row;
    }

    return \@events;
}

sub get_event {
    my $id = shift;

    my $events_table        = 'koha_plugin_com_lmscloud_eventmanagement_events';
    my $event_types_table   = 'koha_plugin_com_lmscloud_eventmanagement_event_types';
    my $target_groups_table = 'koha_plugin_com_lmscloud_eventmanagement_target_groups';

    my $query = <<~"QUERY";
		SELECT events.*, branchname, target_groups.name, event_types.name 
		FROM $events_table AS events 
		LEFT JOIN branches AS b ON e.branch = b.branchcode 
		LEFT JOIN $target_groups_table AS target_groups ON events.target_group = target_groups.id 
		LEFT JOIN $event_types_table AS event_types ON events.event_type = event_types.id
		WHERE events.id = $id
	QUERY

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();

    my $event = $sth->fetchrow_hashref();
    if ( defined $event->{'image'} ) {
        my $rec      = Koha::UploadedFiles->find( $event->{'image'} );
        my $srcimage = $rec->hashvalue . '_' . $rec->filename();
        $event->{'image'} = $srcimage;
    }
    else {
        $event->{'image'} = q{};
    }

    return $event;
}

output_html_with_http_headers $cgi, $cookie, $template->output;
