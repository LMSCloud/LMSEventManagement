package Koha::Plugin::Com::LMSCloud::EventManagement;

## It's good practice to use Modern::Perl
use Modern::Perl;

## Required for all plugins
use base qw(Koha::Plugins::Base);

## We will also need to include any Koha libraries we want to access
use C4::Auth;
use C4::Context;

use Koha::Account::Lines;
use Koha::Account;
use Koha::DateUtils;
use Koha::Libraries;
use Koha::Patron::Categories;
use Koha::Patron;
use Koha::Template::Plugin::Branches;
use GD;
use Koha::UploadedFiles;

use Cwd qw(abs_path);
use Data::Dumper;
use LWP::UserAgent;
use MARC::Record;
use Mojo::JSON qw(decode_json);;
use URI::Escape qw(uri_unescape);

use Locale::Messages;;
Locale::Messages->select_package('gettext_pp');

use Locale::Messages qw(:locale_h :libintl_h);
use POSIX qw(setlocale);

use Koha::Plugin::Com::LMSCloud::EventHelper;

## Here we set our plugin version
our $VERSION = "0.0.1";
our $MINIMUM_VERSION = "18.05";

## Here is our metadata, some keys are required, some are optional
our $metadata = {
    name            => 'Event Management',
    author          => 'LMSCloud',
    date_authored   => '2021-10-15',
    date_updated    => "2021-10-15",
    minimum_version => $MINIMUM_VERSION,
    maximum_version => undef,
    version         => $VERSION,
    description     => 'This plugin implements every available feature '
      . 'of the plugin system and is meant '
      . 'to be documentation and a starting point for writing your own plugins!',
};

## This is the minimum code required for a plugin's 'new' method
## More can be added, but none should be removed
sub new {
    my ( $class, $args ) = @_;

    ## We need to add our metadata here so our base class can access it
    $args->{'metadata'} = $metadata;
    $args->{'metadata'}->{'class'} = $class;

    ## Here, we call the 'new' method for our base class
    ## This runs some additional magic and checking
    ## and returns our actual $self
    my $self = $class->SUPER::new($args);

    return $self;
}

## The existance of a 'report' subroutine means the plugin is capable
## of running a report. This example report can output a list of patrons
## either as HTML or as a CSV file. Technically, you could put all your code
## in the report method, but that would be a really poor way to write code
## for all but the simplest reports
sub report {
    my ( $self, $args ) = @_;
    my $cgi = $self->{'cgi'};

    unless ( $cgi->param('output') ) {
        $self->report_step1();
    }
    else {
        $self->report_step2();
    }
}

## The existance of a 'tool' subroutine means the plugin is capable
## of running a tool. The difference between a tool and a report is
## primarily semantic, but in general any plugin that modifies the
## Koha database should be considered a tool
sub tool {
    my ( $self, $args ) = @_;

    my $cgi = $self->{'cgi'};
    my $op = $cgi->param('op');
    my $template = $self->get_template({ file => 'tool.tt' });	
    
    my $submit_choose_eventtype = $cgi->param('submit_choose_eventtype');
    my $submit_new_event = $cgi->param('submit_new_event');
    my $submit_edit_event = $cgi->param('submit_edit_event');
    
    unless ($submit_new_event || $submit_edit_event) {
		
		if ($submit_choose_eventtype) {
			my $eventtypecode = $cgi->param('eventtypecode');
			my $eventtype = $self->get_event_type($eventtypecode);
			my $branches = Koha::Template::Plugin::Branches->all();
			my $targetgroups= $self->get_target_groups();
			$op = 'add_new_event';
			$template->param(
				branches => $branches,
				eventtype => $eventtype,
				targetgroups => $targetgroups,
			);
		}
		
	} else {
		
		my $title = $cgi->param('title');
		my $eventtype = $cgi->param('eventtype');
		my $branch = $cgi->param('branch');
		my $targetgroup = $cgi->param('targetgroup');
		my $max_age = $cgi->param('max_age');
		#my $pubreg = $cgi->param('pubreg');
		my $max_participants = $cgi->param('max_participants');
		my $costs = $cgi->param('costs');
		my $description = $cgi->param('description');
		my $starttime = $cgi->param('starttime');
		my $endtime = $cgi->param('endtime');
		my $image_id = $cgi->param('uploadedfileid');
		
		if ( $submit_edit_event ) {
			my $id = $cgi->param('id');
			$self->delete_event($id);
		} 
			
		my $result = $self->add_event( $title, 
										$eventtype,
										$branch,		
										$targetgroup,
										$max_age,
										#$pubreg,
										$max_participants,
										$costs,
										$description,
										$starttime,
										$endtime,
										$image_id
									);
		$template->param(
			added_event => $result,
		);
		
	}
	
	if ( $op eq 'delete_event' ) {
		my $id = $cgi->param('id');
		$self->delete_event($id);
	} elsif ( $op eq 'edit_event' ){		
		my $id = $cgi->param('id');
		my $event = $self->get_event($id);
		my $eventtype = $self->get_event_type($event->{'eventtypecode'});
		my $branches = Koha::Template::Plugin::Branches->all();
		my $targetgroups= $self->get_target_groups();
		$template->param(
			branches => $branches,
			eventtype => $eventtype,
			targetgroups => $targetgroups,
			event => $event,
		);
	}

	$template->param(
		op => $op,
		language => C4::Languages::getlanguage($cgi) || 'en',
		mbf_path => abs_path( $self->mbf_path( 'translations' ) ),
		events => $self->get_events(),
		eventtypes => $self->get_event_types(),
	);
	$self->output_html( $template->output() );
}

## The existiance of a 'to_marc' subroutine means the plugin is capable
## of converting some type of file to MARC for use from the stage records
## for import tool
##
## This example takes a text file of the arbtrary format:
## First name:Middle initial:Last name:Year of birth:Title
## and converts each line to a very very basic MARC record
sub to_marc {
    my ( $self, $args ) = @_;

    my $data = $args->{data};

    my $batch = q{};

    foreach my $line ( split( /\n/, $data ) ) {
        my $record = MARC::Record->new();
        my ( $firstname, $initial, $lastname, $year, $title ) = split(/:/, $line );

        ## create an author field.
        my $author_field = MARC::Field->new(
            '100', 1, '',
            a => "$lastname, $firstname $initial.",
            d => "$year-"
        );

        ## create a title field.
        my $title_field = MARC::Field->new(
            '245', '1', '4',
            a => "$title",
            c => "$firstname $initial. $lastname",
        );

        $record->append_fields( $author_field, $title_field );

        $batch .= $record->as_usmarc() . "\x1D";
    }

    return $batch;
}

## If your plugin can process payments online,
## and that feature of the plugin is enabled,
## this method will return true
sub opac_online_payment {
    my ( $self, $args ) = @_;

    return $self->retrieve_data('enable_opac_payments') eq 'Yes';
}

## This method triggers the beginning of the payment process
## It could result in a form displayed to the patron the is submitted
## or go straight to a redirect to the payment service ala paypal
sub opac {
    #~ my ( $self, $args ) = @_;
    #~ my $cgi = $self->{'cgi'};

	#~ my $template = $self->get_template({ file => 'opac_online_payment_begin.tt' });	
    #~ my ( $template, $borrowernumber ) = get_template_and_user(
        #~ {   template_name   => abs_path( $self->mbf_path( 'opac_online_payment_begin.tt' ) ),
            #~ query           => $cgi,
            #~ type            => 'opac',
            #~ authnotrequired => 0,
            #~ is_plugin       => 1,
        #~ }
    #~ );

    #~ #my @accountline_ids = $cgi->multi_param('accountline');

    #~ #my $rs = Koha::Database->new()->schema()->resultset('Accountline');
    #~ #my @accountlines = map { $rs->find($_) } @accountline_ids;

  

    #~ $self->output_html( $template->output() );
    
    my ( $self, $args ) = @_;
    my $cgi = $self->{'cgi'};

    my $template = $self->get_template({ file => 'report-step1.tt' });

    my @libraries = Koha::Libraries->search;
    #my @categories = Koha::Patron::Categories->search_limited({}, {order_by => ['description']});
    $template->param(
        libraries => \@libraries,
        #categories => \@categories,
        type            => 'opac',
    );

    $self->output_html( $template->output() );
}

## This method triggers the beginning of the payment process
## It could result in a form displayed to the patron the is submitted
## or go straight to a redirect to the payment service ala paypal
sub opac_online_payment_begin {
    my ( $self, $args ) = @_;
    my $cgi = $self->{'cgi'};

    my ( $template, $borrowernumber ) = get_template_and_user(
        {   template_name   => abs_path( $self->mbf_path( 'opac_online_payment_begin.tt' ) ),
            query           => $cgi,
            type            => 'opac',
            authnotrequired => 0,
            is_plugin       => 1,
        }
    );

    my @accountline_ids = $cgi->multi_param('accountline');

    my $rs = Koha::Database->new()->schema()->resultset('Accountline');
    my @accountlines = map { $rs->find($_) } @accountline_ids;

    $template->param(
        borrower             => scalar Koha::Patrons->find($borrowernumber),
        payment_method       => scalar $cgi->param('payment_method'),
        enable_opac_payments => $self->retrieve_data('enable_opac_payments'),
        accountlines         => \@accountlines,
    );


    $self->output_html( $template->output() );
}

## This method triggers the end of the payment process
## Should should result in displaying a page indicating
## the success or failure of the payment.
sub opac_online_payment_end {
    my ( $self, $args ) = @_;
    my $cgi = $self->{'cgi'};

    my ( $template, $borrowernumber ) = get_template_and_user(
        {
            template_name =>
              abs_path( $self->mbf_path('opac_online_payment_end.tt') ),
            query           => $cgi,
            type            => 'opac',
            authnotrequired => 0,
            is_plugin       => 1,
        }
    );

    my $m;
    my $v;

    my $amount          = $cgi->param('amount');
    my @accountline_ids = $cgi->multi_param('accountlines_id');

    $m = "no_amount"       unless $amount;
    $m = "no_accountlines" unless @accountline_ids;

    if ( $amount && @accountline_ids ) {
        my $account = Koha::Account->new( { patron_id => $borrowernumber } );
        my @accountlines = Koha::Account::Lines->search(
            {
                accountlines_id => { -in => \@accountline_ids }
            }
        )->as_list();
        foreach my $id (@accountline_ids) {
            $account->pay(
                {
                    amount => $amount,
                    lines  => \@accountlines,
                    note   => "Paid via KitchenSink ImaginaryPay",
                }
            );
        }

        $m = 'valid_payment';
        $v = $amount;
    }

    $template->param(
        borrower      => scalar Koha::Patrons->find($borrowernumber),
        message       => $m,
        message_value => $v,
    );

    $self->output_html( $template->output() );
}

## If your plugin needs to add some CSS to the OPAC, you'll want
## to return that CSS here. Don't forget to wrap your CSS in <style>
## tags. By not adding them automatically for you, you'll have a chance
## to include external CSS files as well!
sub opac_head {
    my ( $self ) = @_;
    
    return '';

    #~ return q|
        #~ <style>
          #~ body {
            #~ background-color: orange;
          #~ }
        #~ </style>
    #~ |;
}

## If your plugin needs to add some javascript in the OPAC, you'll want
## to return that javascript here. Don't forget to wrap your javascript in
## <script> tags. By not adding them automatically for you, you'll have a
## chance to include other javascript files if necessary.
sub opac_js {
    my ( $self ) = @_;
    
    return '';

    #~ return q|
        #~ <script>console.log("Thanks for testing the kitchen sink plugin!");</script>
    #~ |;
}


## If your plugin needs to add some CSS to the staff intranet, you'll want
## to return that CSS here. Don't forget to wrap your CSS in <style>
## tags. By not adding them automatically for you, you'll have a chance
## to include external CSS files as well!
sub intranet_head {
    my ( $self ) = @_;
    
    return '';

    #~ return q|
        #~ <style>
          #~ body {
            #~ background-color: purple;
          #~ }
        #~ </style>
    #~ |;
}

## If your plugin needs to add some javascript in the staff intranet, you'll want
## to return that javascript here. Don't forget to wrap your javascript in
## <script> tags. By not adding them automatically for you, you'll have a
## chance to include other javascript files if necessary.
sub intranet_js {
    my ( $self ) = @_;
    
    return '';

    #~ return q|
        #~ <script>console.log("Thanks for testing the kitchen sink plugin!");</script>
    #~ |;
}

## This method allows you to add new html elements to the catalogue toolbar.
## You'll want to return a string of raw html here, most likely a button or other
## toolbar element of some form. See bug 20968 for more details.
sub intranet_catalog_biblio_enhancements_toolbar_button {
    my ( $self ) = @_;
    
    return '';

    #~ return q|
        #~ <a class="btn btn-default btn-sm" onclick="alert('Peace and long life');">
          #~ <i class="fa fa-hand-spock-o" aria-hidden="true"></i>
          #~ Live long and prosper
        #~ </a>
    #~ |;
}

sub add_target_group {
	my ( $self, $code, $target_group, $min_age, $max_age ) = @_;	
	
	my $table = $self->get_qualified_table_name('targetgroups');
	
	my $query = "SELECT * FROM $table WHERE code = '$code'";
	my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();
    
    my $code_exists = $sth->fetchrow_hashref();
    
    unless ( $code_exists ) {
	
		$query = "INSERT INTO $table (code, targetgroup"; 
		
		if ($min_age ne '') {
			$query = $query.", min_age";
		}
		if ($max_age ne '') {
			$query = $query.", max_age";
		}
		$query = $query.") VALUES ('$code', '$target_group'";
		if ($min_age ne '') {
			$query = $query.", $min_age";
		}
		if ($max_age ne '') {
			$query = $query.", $max_age";
		}
		$query = $query.")";

		$sth = $dbh->prepare($query);
		$sth->execute();
		return 1;
	}
	else {
		return 0;
	}
}


sub delete_target_group {
	my ( $self, $code ) = @_;	
	
	my $table = $self->get_qualified_table_name('targetgroups');
	
	my $query = "DELETE FROM $table WHERE code = '$code'";

	my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();
}

sub get_target_group {
	my ( $self, $code ) = @_;	
	
	my $table = $self->get_qualified_table_name('targetgroups');
		
	my $query = "SELECT * FROM $table WHERE code = '$code'";

	my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();
	
	my $targetgroups = $sth->fetchrow_hashref();
    
	return $targetgroups;
}

sub get_target_groups {
	my $self = shift;
	
	my $table = $self->get_qualified_table_name('targetgroups');
	
	my $query = "SELECT * FROM $table";

	my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();
	
	my @targetgroups;
	while ( my $row = $sth->fetchrow_hashref() ) {
        push( @targetgroups, $row );
    }
    
	return \@targetgroups;
}

sub get_event {
	my $self = shift;
	my $id = shift;
	
	my $table = $self->get_qualified_table_name('events');
	my $tableeventtypes = $self->get_qualified_table_name('eventtypes');
	my $tabletargetgroups = $self->get_qualified_table_name('targetgroups');
	
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

sub get_events {
	my $self = shift;
	
	my $table = $self->get_qualified_table_name('events');
	my $tableeventtypes = $self->get_qualified_table_name('eventtypes');
	my $tabletargetgroups = $self->get_qualified_table_name('targetgroups');
	
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

sub get_event_type {
	my ( $self, $code ) = @_;	
	
	my $table = $self->get_qualified_table_name('eventtypes');
		
	my $query = "SELECT * FROM $table WHERE code = '$code'";

	my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();
	
	my $eventtype = $sth->fetchrow_hashref();
    
	return $eventtype;
}

sub get_event_types {
	my $self = shift;
	
	my $table = $self->get_qualified_table_name('eventtypes');
	
	my $query = "SELECT * FROM $table";

	my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();
	
	my @eventtypes;
	while ( my $row = $sth->fetchrow_hashref() ) {
		if (defined $row->{'imageid'}) {
			my $rec = Koha::UploadedFiles->find( $row->{imageid} );
			my $srcimage = $rec->hashvalue. '_'. $rec->filename();
			$row->{'imagefile'} = $srcimage;
		} else {
			$row->{'imagefile'} = '';
		}
        push( @eventtypes, $row );
    }
    
	return \@eventtypes;
}

sub delete_event {
	my ( $self, $id ) = @_;	
	
	my $table = $self->get_qualified_table_name('events');
	
	my $query = "DELETE FROM $table WHERE eventid = '$id'";

	my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();
}

sub delete_event_type {
	my ( $self, $code ) = @_;	
	
	my $table = $self->get_qualified_table_name('eventtypes');
	
	my $query = "DELETE FROM $table WHERE code = '$code'";

	my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();
}

sub upload_image {
	my ( $self, $image ) = @_;
	
	my $input = $self->{'cgi'}; # CGI->new;
	my $fileID = $input->param('uploadedfileid');
	my $filetype = $input->param('filetype');
	
	if ($fileID) {
		my $upload = Koha::UploadedFiles->find( $fileID );
		if ( $filetype eq 'image' ) {
			my $fh       = $upload->file_handle;
			my $srcimage = GD::Image->new($fh);
			$fh->close if $fh;
			if ( defined $srcimage ) {

				return $srcimage;
			}
		}
	}
	else {
		return '';
	}
}

sub add_event {
	my ( $self, 
			$title, 
			$eventtype,
			$branch,		
			$targetgroup,
			$max_age,
			#$pubreg,
			$max_participants,
			$costs,
			$description,
			$starttime,
			$endtime,
			$image_id ) = @_;
			
	my $table = $self->get_qualified_table_name('events');	
	my $dbh = C4::Context->dbh;

    my $srcimage;
	
	my $query = "INSERT INTO $table (title, eventtypecode, branchcode, targetgroupcode"; 
	my $query_values = "VALUES ('$title', '$eventtype', '$branch', '$targetgroup'";
	

	if ($max_age ne '') {
		$query = $query.", max_age";
		$query_values = $query_values.", '$max_age'";
	}
	#~ if ($public_reg ne '') {
		#~ $query = $query.", public_reg";
		#~ $query_values = $query_values.", '$pubreg'";
	#~ }
	if ($max_participants ne '') {
		$query = $query.", max_participants";
		$query_values = $query_values.", '$max_participants'";
	}
	if ($costs ne '') {
		$query = $query.", costs";
		$query_values = $query_values.", '$costs'";
	}
	if ($description ne '') {
		$query = $query.", description";
		$query_values = $query_values.", '$description'";
	}
	if ($starttime ne '') {
		$query = $query.", starttime";
		$query_values = $query_values.", '$starttime'";
	}
	if ($endtime ne '') {
		$query = $query.", endtime";
		$query_values = $query_values.", '$endtime'";
	}
	if ($image_id ne '' ) {
		$query = $query.", imageid";
		$query_values = $query_values.", '$image_id'";
	}
	
	$query = $query.") ".$query_values.")";

	my $sth = $dbh->prepare($query);
	$sth->execute();
	return 1;
}

sub add_event_type {
	my ( $self, 
			$code, 
			$eventtype,
			$branch,		
			$targetgroup,
			$max_age,
			$pubreg,
			$max_participants,
			$costs,
			$description,
			$image_id ) = @_;
			
	my $table = $self->get_qualified_table_name('eventtypes');
	
	my $query = "SELECT * FROM $table WHERE code = '$code'";
	my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();
    
    my $code_exists = $sth->fetchrow_hashref();
    my $srcimage;
    unless ( $code_exists ) {

		$query = "INSERT INTO $table (code, branchcode, targetgroupcode"; 
		my $query_values = "VALUES ('$code', '$branch', '$targetgroup'";
		
		if ($eventtype ne '') {
			$query = $query.", eventtype";
			$query_values = $query_values.", '$eventtype'";
		}
		if ($max_age ne '') {
			$query = $query.", max_age";
			$query_values = $query_values.", '$max_age'";
		}
		if ($pubreg ne '') {
			$query = $query.", public_reg";
			$query_values = $query_values.", '$pubreg'";
		}
		if ($max_participants ne '') {
			$query = $query.", max_participants";
			$query_values = $query_values.", '$max_participants'";
		}
		if ($costs ne '') {
			$query = $query.", costs";
			$query_values = $query_values.", '$costs'";
		}
		if ($description ne '') {
			$query = $query.", description";
			$query_values = $query_values.", '$description'";
		}
		if ($image_id ne '' ) {
			$query = $query.", imageid";
			$query_values = $query_values.", '$image_id'";
		}
		
		$query = $query.") ".$query_values.")";

		$sth = $dbh->prepare($query);
		$sth->execute();
		return 1;
	}
	else {
		return 0;
	}
}


sub configure_targets {
    my ( $self, $args ) = @_;
    my $cgi = $self->{'cgi'};
    
    my $op = $cgi->param('op');
    my $submit_new_target = $cgi->param('submit_new_target');
    my $submit_edit_target = $cgi->param('submit_edit_target');
    
    my $template = $self->get_template({ file => 'configure_targets.tt' });	
    
    unless ( $submit_new_target || $submit_edit_target) {
		
		if ( $op eq 'delete_attribute_type' ) {		
			my $code = $cgi->param('code');
			delete_target_group($self, $code);	
		} 
		elsif ( $op eq 'edit_attribute_type' ){		
			my $code = $cgi->param('code');
			$template->param(
				target_group => get_target_group($self, $code),
			);
		}	
	} 
	else {	
		my $code = $cgi->param('code');
		my $target_group = $cgi->param('target_group');
		my $min_age = $cgi->param('min_age');
		my $max_age = $cgi->param('max_age');
		my $op = $cgi->param('op');
		if ( $submit_edit_target ) {
			delete_target_group($self, $code);
		} 
		my $success = add_target_group($self, $code, $target_group, $min_age, $max_age);
		
		$template->param(
			added_group => $success,
		);
	}
	
	$template->param(
		op => $op,
		language => C4::Languages::getlanguage($cgi) || 'en',
		mbf_path => abs_path( $self->mbf_path( 'translations' ) ),
		target_groups => $self->get_target_groups(),
	);
	$self->output_html( $template->output() );
}

sub configure_events {
    my ( $self, $args ) = @_;
    my $cgi = $self->{'cgi'};
    
    my $op = $cgi->param('op');
    my $submit_new_eventtype = $cgi->param('submit_new_eventtype');
    my $submit_edit_eventtype = $cgi->param('submit_edit_eventtype');
        
    my $template = $self->get_template({ file => 'configure_events.tt' });	
    
    unless ( $submit_new_eventtype || $submit_edit_eventtype ) {
		
		if ( $op == 'add_new_eventtype' ) {
			my $branches = Koha::Template::Plugin::Branches->all();
			my $target_groups = $self->get_target_groups();
			$template->param(
				branches => $branches,
				target_groups => $target_groups,
			);
		}
		
		if ( $op == 'delete_eventtype' ) {
			my $code = $cgi->param('code');
			$self->delete_event_type($code);
		}
	}
	else {
		my $code = $cgi->param('code');
		my $eventtype = $cgi->param('eventtype');
		my $branch = $cgi->param('branch');
		my $targetgroup = $cgi->param('targetgroup');
		my $max_age = $cgi->param('max_age');
		my $pubreg = $cgi->param('pubreg');
		my $max_participants = $cgi->param('max_participants');
		my $costs = $cgi->param('costs');
		my $description = $cgi->param('description');
		my $image_id = $cgi->param('uploadedfileid');
		
			
		my $result = $self->add_event_type( $code, 
											$eventtype,
											$branch,		
											$targetgroup,
											$max_age,
											$pubreg,
											$max_participants,
											$costs,
											$description,
											$image_id
									);
		$template->param(
			added_event => $result,
		);								
	}
	
	
	
	$template->param(
		op => $op,
		language => C4::Languages::getlanguage($cgi) || 'en',
		mbf_path => abs_path( $self->mbf_path( 'translations' ) ),
		eventtypes => $self->get_event_types(),
	);
	$self->output_html( $template->output() );
}

## If your tool is complicated enough to needs it's own setting/configuration
## you will want to add a 'configure' method to your plugin like so.
## Here I am throwing all the logic into the 'configure' method, but it could
## be split up like the 'report' method is.
sub configure {
    my ( $self, $args ) = @_;
    my $cgi = $self->{'cgi'};
    
    my $step = $cgi->param('step'); 
    my $op = $cgi->param('op');
    
    my $submit_targets = ($cgi->param('submit_new_target') || $cgi->param('submit_edit_target'));
    my $submit_events = ($cgi->param('submit_new_eventtype') || $cgi->param('submit_edit_eventtype') || $cgi->param('submit_image_upload'));
 
    if ( $step eq 'targets' || $submit_targets) {
		$self->configure_targets();			
	} 
	elsif ( $step eq 'events' || $submit_events ) {
		$self->configure_events();
	} 
	else {
		my $template = $self->get_template({ file => 'configure.tt' });	
		$template->param(
			op => $op,
			language => C4::Languages::getlanguage($cgi) || 'en',
			mbf_path => abs_path( $self->mbf_path( 'translations' ) ),
		);
		$self->output_html( $template->output() );
	}	
}

## This is the 'install' method. Any database tables or other setup that should
## be done when the plugin if first installed should be executed in this method.
## The installation method should always return true if the installation succeeded
## or false if it failed.
sub install() {
    my ( $self, $args ) = @_;

    my $tabletarget = $self->get_qualified_table_name('targetgroups');

    my $result = C4::Context->dbh->do( "
        CREATE TABLE IF NOT EXISTS $tabletarget (
            `code` VARCHAR( 10 ) PRIMARY KEY,
            `targetgroup` varchar(30) NOT NULL,
            `min_age` smallint(6),
            `max_age` smallint(6)
        ) ENGINE = INNODB;
    " );
    
    my $tableeventtypes = $self->get_qualified_table_name('eventtypes');
    
    $result |= C4::Context->dbh->do( "
        CREATE TABLE IF NOT EXISTS $tableeventtypes (
            `code` VARCHAR( 10 ) PRIMARY KEY,
            `eventtype` varchar(30) NOT NULL,
            `branchcode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
            `targetgroupcode` varchar(10),
            `max_age` smallint(6),
            `public_reg` bool,
            `max_participants` smallint(6),
            `costs` smallint(6),
            `description` longtext,
            `imageid` int(11),
             FOREIGN KEY (branchcode) REFERENCES branches(branchcode),
             FOREIGN KEY (targetgroupcode) REFERENCES $tableeventtypes(code),
             FOREIGN KEY (imageid) REFERENCES uploaded_files(id)
        ) ENGINE = INNODB;
    " );
    
    my $tableevent = $self->get_qualified_table_name('events');
    
    $result |= C4::Context->dbh->do( "
        CREATE TABLE IF NOT EXISTS $tableevent (
            `eventid` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
            `title` varchar(30) NOT NULL,
            `eventtypecode` VARCHAR( 10 ),
            `branchcode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
            `targetgroupcode` varchar(10),
            `max_age` smallint(6),
            `public_reg` bool,
            `max_participants` smallint(6),
            `costs` smallint(6),
            `description` longtext,
            `imageid` int(11),
            `starttime` DATETIME,
            `endtime` DATETIME,
            `registrationpage` longtext,
             FOREIGN KEY (branchcode) REFERENCES branches(branchcode),
             FOREIGN KEY (eventtypecode) REFERENCES $tableeventtypes(code),
             FOREIGN KEY (targetgroupcode) REFERENCES $tabletarget(code),
             FOREIGN KEY (imageid) REFERENCES uploaded_files(id)
        ) ENGINE = INNODB;
    " );
    
    return $result;
}

## This is the 'upgrade' method. It will be triggered when a newer version of a
## plugin is installed over an existing older version of a plugin
sub upgrade {
    my ( $self, $args ) = @_;

    my $dt = dt_from_string();
    $self->store_data( { last_upgraded => $dt->ymd('-') . ' ' . $dt->hms(':') } );

    return 1;
}

## This method will be run just before the plugin files are deleted
## when a plugin is uninstalled. It is good practice to clean up
## after ourselves!
sub uninstall() {
    my ( $self, $args ) = @_;

    my $table = $self->get_qualified_table_name('targetgroups');

    return C4::Context->dbh->do("DROP TABLE IF EXISTS $table");
}

## These are helper functions that are specific to this plugin
## You can manage the control flow of your plugin any
## way you wish, but I find this is a good approach
sub report_step1 {
    my ( $self, $args ) = @_;
    my $cgi = $self->{'cgi'};

    my $template = $self->get_template({ file => 'report-step1.tt' });

    my @libraries = Koha::Libraries->search;
    #my @categories = Koha::Patron::Categories->search_limited({}, {order_by => ['description']});
    $template->param(
        libraries => \@libraries,
        #categories => \@categories,
    );

    $self->output_html( $template->output() );
}

sub report_step2 {
    my ( $self, $args ) = @_;
    my $cgi = $self->{'cgi'};

    my $dbh = C4::Context->dbh;

    my $branch                = $cgi->param('branch');
    my $category_code         = $cgi->param('categorycode');
    my $borrower_municipality = $cgi->param('borrower_municipality');
    my $output                = $cgi->param('output');

    my $fromDay   = $cgi->param('fromDay');
    my $fromMonth = $cgi->param('fromMonth');
    my $fromYear  = $cgi->param('fromYear');

    my $toDay   = $cgi->param('toDay');
    my $toMonth = $cgi->param('toMonth');
    my $toYear  = $cgi->param('toYear');

    my ( $fromDate, $toDate );
    if ( $fromDay && $fromMonth && $fromYear && $toDay && $toMonth && $toYear )
    {
        $fromDate = "$fromYear-$fromMonth-$fromDay";
        $toDate   = "$toYear-$toMonth-$toDay";
    }

    my $query = "
        SELECT firstname, surname, address, city, zipcode, city, zipcode, dateexpiry FROM borrowers 
        WHERE branchcode LIKE '$branch'
        AND categorycode LIKE '$category_code'
    ";

    if ( $fromDate && $toDate ) {
        $query .= "
            AND DATE( dateexpiry ) >= DATE( '$fromDate' )
            AND DATE( dateexpiry ) <= DATE( '$toDate' )  
        ";
    }

    my $sth = $dbh->prepare($query);
    $sth->execute();

    my @results;
    while ( my $row = $sth->fetchrow_hashref() ) {
        push( @results, $row );
    }

    my $filename;
    if ( $output eq "csv" ) {
        print $cgi->header( -attachment => 'borrowers.csv' );
        $filename = 'report-step2-csv.tt';
    }
    else {
        print $cgi->header();
        $filename = 'report-step2-html.tt';
    }

    my $template = $self->get_template({ file => $filename });

    $template->param(
        date_ran     => dt_from_string(),
        results_loop => \@results,
        branch       => GetBranchName($branch),
    );

    unless ( $category_code eq '%' ) {
        $template->param( category_code => $category_code );
    }

    print $template->output();
}

sub tool_step1 {
    my ( $self, $args ) = @_;
    my $cgi = $self->{'cgi'};

    my $template = $self->get_template({ file => 'tool-step1.tt' });

    $self->output_html( $template->output() );
}

sub tool_step2 {
    my ( $self, $args ) = @_;
    my $cgi = $self->{'cgi'};

    my $template = $self->get_template({ file => 'tool-step2.tt' });

    my $borrowernumber = C4::Context->userenv->{'number'};
    my $borrower = Koha::Patrons->find( $borrowernumber );
    $template->param( 'victim' => $borrower->unblessed() );
    $template->param( 'victim' => $borrower );

    $borrower->firstname('Bob')->store;

    my $dbh = C4::Context->dbh;

    my $table = $self->get_qualified_table_name('mytable');

    my $sth   = $dbh->prepare("SELECT DISTINCT(borrowernumber) FROM $table");
    $sth->execute();
    my @victims;
    while ( my $r = $sth->fetchrow_hashref() ) {
        my $brw = Koha::Patrons->find( $r->{'borrowernumber'} )->unblessed();
        push( @victims, ( $brw ) );
    }
    $template->param( 'victims' => \@victims );

    $dbh->do( "INSERT INTO $table ( borrowernumber ) VALUES ( ? )",
        undef, ($borrowernumber) );

    $self->output_html( $template->output() );
}

## API methods
# If your plugin implements API routes, then the 'api_routes' method needs
# to be implemented, returning valid OpenAPI 2.0 paths serialized as a hashref.
# It is a good practice to actually write OpenAPI 2.0 path specs in JSON on the
# plugin and read it here. This allows to use the spec for mainline Koha later,
# thus making this a good prototyping tool.

sub api_routes {
    my ( $self, $args ) = @_;

    my $spec_str = $self->mbf_read('openapi.json');
    my $spec     = decode_json($spec_str);

    return $spec;
}

sub api_namespace {
    my ( $self ) = @_;
    
    return 'kitchensink';
}

sub static_routes {
    my ( $self, $args ) = @_;

    my $spec_str = $self->mbf_read('staticapi.json');
    my $spec     = decode_json($spec_str);

    return $spec;
}

=head3 opac_detail_xslt_variables

Plugin hook injecting variables to the OPAC detail XSLT

=cut

sub opac_detail_xslt_variables {
    my ( $self, $params ) = @_;

    return { nice_message => 'We love Koha /' };
}

=head3 opac_results_xslt_variables

Plugin hook injecting variables to the OPAC results XSLT

=cut

sub opac_results_xslt_variables {
    my ( $self, $params ) = @_;

    return { nice_message => 'We love Koha /' };
}

=head3 cronjob_nightly

Plugin hook running code from a cron job

=cut

sub cronjob_nightly {
    my ( $self ) = @_;

    print "Remember to clean the kitchen\n";
}

=head3 before_send_messages

Plugin hook that runs right before the message queue is processed
in process_message_queue.pl

=cut

sub before_send_messages {
    my ( $self, $params ) = @_;

    print "Plugin hook before_send_message called with the params: " . Data::Dumper::Dumper( $params );
}


1;
