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

use Carp;
use C4::Context;
use C4::Output;
use C4::Auth;
use Koha::Email;
use Mail::Sendmail;
use MIME::QuotedPrint;
use MIME::Base64;
use Koha::Patrons;
use Koha::Patron::Category;
use Koha::Patron::Categories;
use Koha::DateUtils;
use Cwd            qw( abs_path );
use File::Basename qw( dirname );
use POSIX 'strftime';
use POSIX 'floor';
use DateTime;

use Koha::UploadedFiles;

use CGI qw ( -utf8 );

use Locale::Messages;
Locale::Messages->select_package('gettext_pp');

use Locale::Messages qw(:locale_h :libintl_h);

my $pluginDir = dirname(abs_path($0));

my $template_name = $pluginDir . '/events-grid.tt';

my $cgi = new CGI;

# initial value -- calendar is displayed while $op is undef
# otherwise one of the form pages is displayed
my $op = $cgi->param('op');

my ( $template, $borrowernumber, $cookie ) = get_template_and_user(
    {
        template_name   => $template_name,
        query           => $cgi,
        type            => "opac",
        authnotrequired => 1,
        is_plugin       => 1,
    }
);

$template->param(
    language => C4::Languages::getlanguage($cgi) || 'en',
    mbf_path => abs_path( '../translations' )
);

if ( !defined($op) ) {
    
    
    my $used_target_groups = get_used_target_groups();	
    my $used_event_types = get_used_event_types();	
    my $used_branches = get_used_branches();
	my $events = get_events();
	

	$template->param(
		plugin_dir        => $pluginDir,
		op                => $op,
		events			  => $events,
		used_target_groups => $used_target_groups,
		used_event_types  => $used_event_types,
		used_branches	  => $used_branches,
	);
} elsif ( $op eq 'detail' ) {
	
	my $id = $cgi->param('id');
	my $event = get_event($id);
    
	$template->param(
		plugin_dir        => $pluginDir,
		op                => $op,
		event			  => $event,
	);
}

sub get_used_target_groups {

	my $table = 'koha_plugin_com_lmscloud_eventmanagement_events';
	my $tabletargetgroups = 'koha_plugin_com_lmscloud_eventmanagement_targetgroups';
	
	my $query = "
		SELECT targetgroupcode, targetgroup, count(*) AS count  
		FROM $table e, $tabletargetgroups t 
		WHERE e.targetgroupcode = t.code
		GROUP BY targetgroupcode
	";

	my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();
	
	my @targetgroups;
	while ( my $row = $sth->fetchrow_hashref() ) {
        push( @targetgroups, $row );
    }
    
	return \@targetgroups;
}

sub get_used_event_types {

	my $table = 'koha_plugin_com_lmscloud_eventmanagement_events';
	my $tableeventtypes = 'koha_plugin_com_lmscloud_eventmanagement_eventtypes';
	
	my $query = "
		SELECT eventtypecode, eventtype, count(*) AS count 
		FROM $table e, $tableeventtypes t 
		WHERE e.eventtypecode = t.code
		GROUP BY eventtypecode
	";

	my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();
	
	my @eventtypes;
	while ( my $row = $sth->fetchrow_hashref() ) {
        push( @eventtypes, $row );
    }
    
	return \@eventtypes;
}

sub get_used_branches {

	my $table = 'koha_plugin_com_lmscloud_eventmanagement_events';
	my $branches = 'koha_plugin_com_lmscloud_eventmanagement_eventtypes';
	
	my $query = "
		SELECT e.branchcode, branchname, count(*) AS count 
		FROM $table e, branches b 
		WHERE e.branchcode = b.branchcode
		GROUP BY e.branchcode
	";

	my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();
	
	my @branches;
	while ( my $row = $sth->fetchrow_hashref() ) {
        push( @branches, $row );
    }
    
	return \@branches;
}


sub get_events {
	
	my $table = 'koha_plugin_com_lmscloud_eventmanagement_events';
	my $tableeventtypes = 'koha_plugin_com_lmscloud_eventmanagement_eventtypes';
	my $tabletargetgroups = 'koha_plugin_com_lmscloud_eventmanagement_targetgroups';
	
	#my $query = "SELECT * FROM $table";
	my $query = "
		SELECT e.*, branchname,t.targetgroup,et.eventtype 
		FROM $table AS e
		LEFT JOIN branches AS b ON e.branchcode=b.branchcode 
		LEFT JOIN $tabletargetgroups AS t ON e.targetgroupcode = t.code 
		LEFT JOIN $tableeventtypes AS et ON e.eventtypecode = et.code
	";

	my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();
	
	my @events;
	while ( my $row = $sth->fetchrow_hashref() ) {
		if (defined $row->{'imageid'}) {
			my $rec = Koha::UploadedFiles->find( $row->{imageid} );
			my $srcimage = $rec->hashvalue. '_'. $rec->filename();
			$row->{'imagefile'} = $srcimage;
		} else {
			$row->{'imagefile'} = '';
		}
		
        push( @events, $row );
    }
    
	return \@events;
}

sub get_event {
	my $id = shift;

	my $table = 'koha_plugin_com_lmscloud_eventmanagement_events';
	my $tableeventtypes = 'koha_plugin_com_lmscloud_eventmanagement_eventtypes';
	my $tabletargetgroups = 'koha_plugin_com_lmscloud_eventmanagement_targetgroups';
	
	#my $query = "SELECT * FROM $table";
	my $query = "
		SELECT e.*, branchname,t.targetgroup,et.eventtype 
		FROM $table AS e 
		LEFT JOIN branches AS b ON e.branchcode=b.branchcode 
		LEFT JOIN $tabletargetgroups AS t ON e.targetgroupcode = t.code 
		LEFT JOIN $tableeventtypes AS et ON e.eventtypecode = et.code
		WHERE eventid = $id
	";

	my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();
	
	my $event = $sth->fetchrow_hashref();
	if (defined $event->{'imageid'}) {
		my $rec = Koha::UploadedFiles->find( $event->{imageid} );
		my $srcimage = $rec->hashvalue. '_'. $rec->filename();
		$event->{'imagefile'} = $srcimage;
	} else {
		$event->{'imagefile'} = '';
	}
    
	return $event;
}



output_html_with_http_headers $cgi, $cookie, $template->output;