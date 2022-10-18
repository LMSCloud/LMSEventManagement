package Koha::Plugin::Com::LMSCloud::EventManagement;

## It's good practice to use Modern::Perl
use Modern::Perl;
use utf8;
use 5.032;

## Required for all plugins
use base qw(Koha::Plugins::Base);

## We will also need to include any Koha libraries we want to access
use C4::Auth;
use C4::Context;
use C4::Languages qw(getlanguage);

use Koha::Account::Lines;
use Koha::Account;
use Koha::Database;
use Koha::DateUtils;
use Koha::Libraries;
use Koha::Patron::Categories;
use Koha::Patron;
use Koha::Patrons;
use Koha::Template::Plugin::Branches;
use Koha::UploadedFiles;

use GD::Image;
use Cwd qw(abs_path);
use LWP::UserAgent;
use MARC::Record;
use Mojo::JSON qw(decode_json);
use URI::Escape qw(uri_unescape);
use Try::Tiny;

use Locale::Messages;
Locale::Messages->select_package('gettext_pp');

use Locale::Messages qw(:locale_h :libintl_h);
use POSIX qw(setlocale);

use Koha::Plugin::Com::LMSCloud::EventManagement::Validators qw(validate_event validate_event_type);

## Here we set our plugin version
our $VERSION         = '0.0.1';
our $MINIMUM_VERSION = '18.05';

## Here is our metadata, some keys are required, some are optional
our $METADATA = {
    name            => 'LMSEventManagement',
    author          => 'LMSCloud GmbH',
    date_authored   => '2021-10-15',
    date_updated    => '2022-10-18',
    minimum_version => $MINIMUM_VERSION,
    maximum_version => undef,
    version         => $VERSION,
    description     => 'This plugin makes managing events with koha a breeze!'
};

## This is the minimum code required for a plugin's 'new' method
## More can be added, but none should be removed
sub new {
    my ( $class, $args ) = @_;

    ## We need to add our metadata here so our base class can access it
    $args->{'metadata'} = $METADATA;
    $args->{'metadata'}->{'class'} = $class;

    ## Here, we call the 'new' method for our base class
    ## This runs some additional magic and checking
    ## and returns our actual $self
    my $self = $class->SUPER::new($args);

    return $self;
}

sub tool {
    my ( $self, $args ) = @_;

    my $template = $self->get_template( { file => 'tools/tool.tt' } );
    my $cgi      = $self->{'cgi'};
    my $op       = $cgi->param('op');

    given ($op) {
        when (q{}) {
            $template = $self->get_template( { file => 'tools/tool.tt' } );

            $template->param(
                op     => q{},
                events => $self->get_events(),
            );

            return $self->output_html( $template->output() );
        }

        when (q{choose_event_type}) {
            $template = $self->get_template( { file => 'tools/choose_event_type.tt' } );

            $template->param( event_types => $self->get_event_types(), );

            return $self->output_html( $template->output() );
        }

        when (q{add_event}) {
            $template = $self->get_template( { file => 'tools/add_event.tt' } );

            $template->param(
                event_type    => $self->get_event_type( scalar $cgi->param('event_type_id') ),
                branches      => Koha::Template::Plugin::Branches->all(),
                target_groups => $self->get_target_groups(),
            );

            return $self->output_html( $template->output() );
        }

        when (q{submit_add_event}) {
            my $event_type = $cgi->param('event_type');
            my $event_type_is_added;

            use Data::Dumper;
            warn Dumper('TEST 1');

            # If the event type isn't already defined, we create it
            if ( !$event_type && scalar $cgi->param('submit_add_event_type') ) {
                $event_type_is_added = $self->add_event_type(
                    {   id                => scalar $cgi->param('event_type_id'),
                        branch            => scalar $cgi->param('branch'),
                        target_group      => scalar $cgi->param('target_group'),
                        name              => scalar $cgi->param('event_type_name'),
                        max_age           => scalar $cgi->param('max_age'),
                        open_registration => scalar $cgi->param('open_registration'),
                        max_participants  => scalar $cgi->param('max_participants'),
                        fee               => scalar $cgi->param('fee'),
                        description       => scalar $cgi->param('description'),
                        image             => scalar $cgi->param('image')
                    }
                );
            }

            my $event_is_added = $self->add_event(
                {   title             => scalar $cgi->param('title'),
                    event_type        => $event_type_is_added->{'ok'} ? $event_type_is_added->{'id'} : q{},
                    branch            => scalar $cgi->param('branch'),
                    target_group      => scalar $cgi->param('target_group'),
                    max_age           => scalar $cgi->param('max_age'),
                    open_registration => scalar $cgi->param('open_registration'),
                    start_time        => scalar $cgi->param('start_time'),
                    end_time          => scalar $cgi->param('end_time'),
                    max_participants  => scalar $cgi->param('max_participants'),
                    fee               => scalar $cgi->param('fee'),
                    description       => scalar $cgi->param('description'),
                    image_id          => scalar $cgi->param('uploaded_file_id'),
                }
            );

            if ($event_is_added) {
                $self->get_template( { file => 'tools/tool.tt' } );

                $template->param( events => $self->get_events() );

                return $self->output_html( $template->output() );
            }

            $self->get_template( { file => 'tools/add_event.tt' } );

            $template->param(
                event_type    => $self->get_event_type( scalar $cgi->param('event_type_id') ),
                branches      => Koha::Template::Plugin::Branches->all(),
                target_groups => $self->get_target_groups(),
            );

            return $self->output_html( $template->output() );

        }
    }

    #     when (q{edit_event}) {
    #         my $id = $cgi->param('id');

    #         if ($submit_edit_event) {
    #             $self->delete_event($id);
    #             $self->add_event(
    #                 {   title            => scalar $cgi->param('title'),
    #                     event_type       => scalar $cgi->param('event_type'),
    #                     branch           => scalar $cgi->param('branch'),
    #                     target_group     => scalar $cgi->param('target_group'),
    #                     max_age          => scalar $cgi->param('max_age'),
    #                     max_participants => scalar $cgi->param('max_participants'),
    #                     fee              => scalar $cgi->param('fee'),
    #                     description      => scalar $cgi->param('description'),
    #                     start_time       => scalar $cgi->param('start_time'),
    #                     end_time         => scalar $cgi->param('end_time'),
    #                     image_id         => scalar $cgi->param('uploadedfileid'),
    #                 }
    #             );
    #         }

    #         my $event         = $self->get_event($id);
    #         my $branches      = Koha::Template::Plugin::Branches->all();
    #         my $target_groups = $self->get_target_groups();
    #         my $event_type    = $self->get_event_type( $event->{'id'} );

    #         $template->param(
    #             branches      => $branches,
    #             event_type    => $event_type,
    #             target_groups => $target_groups,
    #             event         => $event,
    #         );

    #         return $self->output_html( $template->output() );
    #     }

    #     when (q{delete_event}) {
    #         my $id = $cgi->param('id');

    #         $self->delete_event($id);
    #         $template->param(
    #             op         => $op,
    #             language   => C4::Languages::getlanguage($cgi) || 'en',
    #             mbf_path   => abs_path( $self->mbf_path('translations') ),
    #             events     => $self->get_events(),
    #             eventtypes => $self->get_event_types(),
    #         );

    #         return $self->output_html( $template->output() );
    #     }

    # }

    return $self->output_html( $template->output() );
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
sub opac_online_payment_begin {
    my ( $self, $args ) = @_;
    my $cgi = $self->{'cgi'};

    my ( $template, $borrowernumber ) = get_template_and_user(
        {   template_name   => abs_path( $self->mbf_path('opac_online_payment_begin.tt') ),
            query           => $cgi,
            type            => 'opac',
            authnotrequired => 0,
            is_plugin       => 1,
        }
    );

    my @accountline_ids = $cgi->multi_param('accountline');

    my $rs           = Koha::Database->new()->schema()->resultset('Accountline');
    my @accountlines = map { $rs->find($_) } @accountline_ids;

    $template->param(
        borrower             => scalar Koha::Patrons->find($borrowernumber),
        payment_method       => scalar $cgi->param('payment_method'),
        enable_opac_payments => $self->retrieve_data('enable_opac_payments'),
        accountlines         => \@accountlines,
    );

    return $self->output_html( $template->output() );
}

## This method triggers the end of the payment process
## Should should result in displaying a page indicating
## the success or failure of the payment.
sub opac_online_payment_end {
    my ( $self, $args ) = @_;
    my $cgi = $self->{'cgi'};

    my ( $template, $borrowernumber ) = get_template_and_user(
        {   template_name   => abs_path( $self->mbf_path('opac_online_payment_end.tt') ),
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

    $m = $amount          || 'no_amount';
    $m = @accountline_ids || 'no_accountlines';

    if ( $amount && @accountline_ids ) {
        my $account      = Koha::Account->new( { patron_id => $borrowernumber } );
        my @accountlines = Koha::Account::Lines->search( { accountlines_id => { -in => \@accountline_ids } } )->as_list();
        foreach my $id (@accountline_ids) {
            $account->pay(
                {   amount => $amount,
                    lines  => \@accountlines,
                    note   => 'Paid via KitchenSink ImaginaryPay',
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

    return $self->output_html( $template->output() );
}

## If your plugin needs to add some CSS to the OPAC, you'll want
## to return that CSS here. Don't forget to wrap your CSS in <style>
## tags. By not adding them automatically for you, you'll have a chance
## to include external CSS files as well!
sub opac_head {
    my ($self) = @_;

    return q{};

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
    my ($self) = @_;

    return q{};

    #~ return q|
    #~ <script>console.log("Thanks for testing the kitchen sink plugin!");</script>
    #~ |;
}

## If your plugin needs to add some CSS to the staff intranet, you'll want
## to return that CSS here. Don't forget to wrap your CSS in <style>
## tags. By not adding them automatically for you, you'll have a chance
## to include external CSS files as well!
sub intranet_head {
    my ($self) = @_;

    return q{};

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
    my ($self) = @_;

    return q{};

    #~ return q|
    #~ <script>console.log("Thanks for testing the kitchen sink plugin!");</script>
    #~ |;
}

sub add_target_group {
    my ($args) = @_;

    my $query = qq{SELECT * FROM $args->{'table'} WHERE code = ?};
    my $dbh   = C4::Context->dbh;
    my $sth   = $dbh->prepare($query);

    $sth->execute( $args->{'code'} );

    my $code_exists = $sth->fetchrow_hashref();

    if ( !$code_exists ) {

        $query = qq{INSERT INTO $args->{'table'} (code, targetgroup};

        if ( $args->{'min_age'} ne q{} ) {
            $query = $query . q{, min_age};
        }
        if ( $args->{'max_age'} ne q{} ) {
            $query = $query . q{, max_age};
        }
        $query = $query . ") VALUES ('$args->{'code'}', '$args->{'target_code'}'";
        if ( $args->{'min_age'} ne q{} ) {
            $query = $query . ", $args->{'min_age'}";
        }
        if ( $args->{'max_age'} ne q{} ) {
            $query = $query . ", $args->{'max_age'}";
        }
        $query = $query . ')';

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

    my $table = $self->get_qualified_table_name('target_groups');
    my $query = qq{DELETE FROM $table WHERE code = ?};

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute($code);

    return;
}

sub get_target_group {
    my ( $self, $code ) = @_;

    my $table = $self->get_qualified_table_name('target_groups');
    my $query = qq{SELECT * FROM $table WHERE code = ?};

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute($code);

    my $targetgroups = $sth->fetchrow_hashref();

    return $targetgroups;
}

sub get_target_groups {
    my ($self) = @_;

    my $table = $self->get_qualified_table_name('target_groups');
    my $query = "SELECT * FROM $table";

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();

    my @targetgroups;
    while ( my $row = $sth->fetchrow_hashref() ) {
        push @targetgroups, $row;
    }

    return \@targetgroups;
}

sub get_event {
    my ( $self, $id ) = @_;

    my $table             = $self->get_qualified_table_name('events');
    my $tableeventtypes   = $self->get_qualified_table_name('event_types');
    my $tabletargetgroups = $self->get_qualified_table_name('target_groups');

    my $query = <<~"STATEMENT";
		SELECT events.*, branchcode, target_groups.name, event_types.name 
		FROM $table AS events 
		LEFT JOIN branches AS branches ON events.branchcode = branches.branchcode 
		LEFT JOIN $tabletargetgroups AS target_groups ON events.target_group = target_groups.id 
		LEFT JOIN $tableeventtypes AS event_types ON events.event_type = event_types.id
		WHERE id = $id
	STATEMENT

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();

    my $event = $sth->fetchrow_hashref();
    if ( defined $event->{'imageid'} ) {
        my $rec       = Koha::UploadedFiles->find( $event->{imageid} );
        my $src_image = $rec->hashvalue . '_' . $rec->filename();
        $event->{'imagefile'} = $src_image;
    }
    else {
        $event->{'imagefile'} = q{};
    }

    return $event;
}

sub get_events {
    my ($self) = @_;

    my $table             = $self->get_qualified_table_name('events');
    my $tableeventtypes   = $self->get_qualified_table_name('event_types');
    my $tabletargetgroups = $self->get_qualified_table_name('target_groups');

    my $query = <<~"STATEMENT";
		SELECT events.*, branchcode, target_groups.name, event_types.name
		FROM $table AS events
		LEFT JOIN branches AS branches ON events.branch = branches.branchcode 
		LEFT JOIN $tabletargetgroups AS target_groups ON events.target_group = target_groups.id 
		LEFT JOIN $tableeventtypes AS event_types ON events.event_type = event_types.id
	STATEMENT

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();

    my @events;
    while ( my $row = $sth->fetchrow_hashref() ) {
        if ( defined $row->{'imageid'} ) {
            my $rec       = Koha::UploadedFiles->find( $row->{imageid} );
            my $src_image = $rec->hashvalue . '_' . $rec->filename();
            $row->{'imagefile'} = $src_image;
        }
        else {
            $row->{'imagefile'} = q{};
        }

        push @events, $row;
    }

    return \@events;
}

sub get_event_type {
    my ( $self, $id ) = @_;

    my $table = $self->get_qualified_table_name('event_types');

    my $query = qq{SELECT * FROM $table WHERE id = ?};

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute($id);

    my $eventtype = $sth->fetchrow_hashref();

    return $eventtype;
}

sub get_event_types {
    my ($self) = @_;

    my $table = $self->get_qualified_table_name('event_types');

    my $query = "SELECT * FROM $table";

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();

    my @eventtypes;
    while ( my $row = $sth->fetchrow_hashref() ) {
        if ( defined $row->{'imageid'} ) {
            my $rec       = Koha::UploadedFiles->find( $row->{imageid} );
            my $src_image = $rec->hashvalue . '_' . $rec->filename();
            $row->{'imagefile'} = $src_image;
        }
        else {
            $row->{'imagefile'} = q{};
        }
        push @eventtypes, $row;
    }

    return \@eventtypes;
}

sub delete_event {
    my ( $self, $id ) = @_;

    my $table = $self->get_qualified_table_name('events');
    my $query = qq{DELETE FROM $table WHERE eventid = ?};

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute($id);

    return;
}

sub delete_event_type {
    my ( $self, $code ) = @_;

    my $table = $self->get_qualified_table_name('event_types');
    my $query = qq{DELETE FROM $table WHERE code = ?};

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute($code);

    return;
}

sub upload_image {
    my ( $self, $image ) = @_;

    my $input    = $self->{'cgi'};                    # CGI->new;
    my $file_id  = $input->param('uploadedfileid');
    my $filetype = $input->param('filetype');

    return $file_id && $filetype eq 'image'
        ? sub {
        my $upload    = Koha::UploadedFiles->find($file_id);
        my $fh        = $upload->file_handle;
        my $src_image = GD::Image->new($fh);
        $fh->close if $fh;
        return $src_image || 0;
        }
        : q{};
}

sub add_event {
    my ( $self, $args ) = @_;

    my $table = $self->get_qualified_table_name('events');
    my $dbh   = C4::Context->dbh;

    my $src_image;

    my $query        = "INSERT INTO $table (title, event_type, branch, target_group";
    my $query_values = "VALUES ('$args->{'title'}', '$args->{'event_type'}', '$args->{'branch'}', '$args->{'target_group'}'";

    if ( $args->{'max_age'} ne q{} ) {
        $query        = $query . q{, max_age};
        $query_values = $query_values . ", '$args->{'max_age'}'";
    }
    if ( $args->{'open_registration'} ne q{} ) {
        $query        = $query . q{, open_registration};
        $query_values = $query_values . ", '$args->{'open_registration'}'";
    }
    if ( $args->{'max_participants'} ne q{} ) {
        $query        = $query . q{, max_participants};
        $query_values = $query_values . ", '$args->{'max_participants'}'";
    }
    if ( $args->{'fee'} ne q{} ) {
        $query        = $query . q{, fee};
        $query_values = $query_values . ", '$args->{'fee'}'";
    }
    if ( $args->{'description'} ne q{} ) {
        $query        = $query . q{, description};
        $query_values = $query_values . ", '$args->{'description'}'";
    }
    if ( $args->{'start_time'} ne q{} ) {
        $query        = $query . q{, start_time};
        $query_values = $query_values . ", '$args->{'start_time'}'";
    }
    if ( $args->{'end_time'} ne q{} ) {
        $query        = $query . q{, end_time};
        $query_values = $query_values . ", '$args->{'end_time'}'";
    }
    if ( $args->{'image'} ne q{} ) {
        $query        = $query . q{, image};
        $query_values = $query_values . ", '$args->{'image'}'";
    }

    $query = $query . qq{) $query_values)};

    my $sth = $dbh->prepare($query);
    $sth->execute();
    return 1;
}

sub add_event_type {
    my ( $self, $args ) = @_;

    my $table = $self->get_qualified_table_name('event_types');
    my $query = qq{SELECT * FROM $table WHERE id = ?};

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);

    $sth->execute( $args->{'id'} );

    my $id_exists = $sth->fetchrow_hashref();

    if ( !$id_exists ) {
        $query = "INSERT INTO $table (id, branch, target_group";
        my $query_values = "VALUES ('$args->{'id'}', '$args->{'branch'}', '$args->{'target_group'}'";

        if ( $args->{'name'} ne q{} ) {
            $query        = $query . ', name';
            $query_values = $query_values . ", '$args->{'name'}'";
        }
        if ( $args->{'max_age'} ne q{} ) {
            $query        = $query . ', max_age';
            $query_values = $query_values . ", '$args->{'max_age'}'";
        }
        if ( $args->{'open_registration'} ne q{} ) {
            $query        = $query . ', open_registration';
            $query_values = $query_values . ", '$args->{'open_registration'}'";
        }
        if ( $args->{'max_participants'} ne q{} ) {
            $query        = $query . ', max_participants';
            $query_values = $query_values . ", '$args->{'max_participants'}'";
        }
        if ( $args->{'fee'} ne q{} ) {
            $query        = $query . ', fee';
            $query_values = $query_values . ", '$args->{'fee'}'";
        }
        if ( $args->{'description'} ne q{} ) {
            $query        = $query . ', description';
            $query_values = $query_values . ", '$args->{'description'}'";
        }
        if ( $args->{'image'} ne q{} ) {
            $query        = $query . ', image';
            $query_values = $query_values . ", '$args->{'image'}'";
        }

        $query = $query . ') ' . $query_values . ')';

        $sth = $dbh->prepare($query);
        $sth->execute();

        return {
            ok => 1,
            id => $args->{'id'},
        };
    }
    else {
        return { ok => 0, };
    }
}

sub configure_targets {
    my ( $self, $args ) = @_;

    my $cgi = $self->{'cgi'};

    my $op                 = $cgi->param('op');
    my $submit_new_target  = $cgi->param('submit_new_target');
    my $submit_edit_target = $cgi->param('submit_edit_target');

    my $template = $self->get_template( { file => 'configure_targets.tt' } );

    if ( !( $submit_new_target || $submit_edit_target ) ) {

        if ( $op eq 'delete_attribute_type' ) {
            my $code = $cgi->param('code');
            delete_target_group( $self, $code );
        }
        elsif ( $op eq 'edit_attribute_type' ) {
            my $code = $cgi->param('code');
            $template->param( target_group => get_target_group( $self, $code ), );
        }
    }
    else {
        my $code = $cgi->param('code');

        $op = $cgi->param('op');

        if ($submit_edit_target) {
            delete_target_group( $self, $code );
        }
        my $success = add_target_group(
            {   table       => $self->get_qualified_table_name('target_groups'),
                code        => $code,
                target_code => scalar $cgi->param('target_group'),
                min_age     => scalar $cgi->param('min_age'),
                max_age     => scalar $cgi->param('max_age')
            }
        );

        $template->param( added_group => $success, );
    }

    $template->param(
        op            => $op,
        language      => C4::Languages::getlanguage($cgi) || 'en',
        mbf_path      => abs_path( $self->mbf_path('translations') ),
        target_groups => $self->get_target_groups(),
    );

    return $self->output_html( $template->output() );
}

sub configure_events {
    my ( $self, $args ) = @_;

    my $cgi = $self->{'cgi'};

    my $op                    = $cgi->param('op');
    my $submit_new_eventtype  = $cgi->param('submit_new_eventtype');
    my $submit_edit_eventtype = $cgi->param('submit_edit_eventtype');

    my $template = $self->get_template( { file => 'configure_events.tt' } );

    if ( !( $submit_new_eventtype || $submit_edit_eventtype ) ) {

        if ( $op eq 'add_new_eventtype' ) {
            my $branches      = Koha::Template::Plugin::Branches->all();
            my $target_groups = $self->get_target_groups();
            $template->param(
                branches      => $branches,
                target_groups => $target_groups,
            );
        }

        if ( $op eq 'delete_eventtype' ) {
            my $code = $cgi->param('code');
            $self->delete_event_type($code);
        }
    }
    else {

        my $result = $self->add_event_type(
            {   branch           => scalar $cgi->param('branch'),
                code             => scalar $cgi->param('code'),
                costs            => scalar $cgi->param('costs'),
                description      => scalar $cgi->param('description'),
                eventtype        => scalar $cgi->param('eventtype'),
                max_age          => scalar $cgi->param('max_age'),
                max_participants => scalar $cgi->param('max_participants'),
                pubreg           => scalar $cgi->param('pubreg'),
                targetgroup      => scalar $cgi->param('targetgroup'),
            }
        );
        $template->param( added_event => $result, );
    }

    $template->param(
        op         => $op,
        language   => C4::Languages::getlanguage($cgi) || 'en',
        mbf_path   => abs_path( $self->mbf_path('translations') ),
        eventtypes => $self->get_event_types(),
    );
    return $self->output_html( $template->output() );
}

## If your tool is complicated enough to needs it's own setting/configuration
## you will want to add a 'configure' method to your plugin like so.
## Here I am throwing all the logic into the 'configure' method, but it could
## be split up like the 'report' method is.
sub configure {
    my ( $self, $args ) = @_;

    my $cgi = $self->{'cgi'};

    my $step = $cgi->param('step');
    my $op   = $cgi->param('op');

    my $submit_targets = ( $cgi->param('submit_new_target')    || $cgi->param('submit_edit_target') );
    my $submit_events  = ( $cgi->param('submit_new_eventtype') || $cgi->param('submit_edit_eventtype') );

    if ( $step eq 'targets' || $submit_targets ) {
        return $self->configure_targets();
    }
    elsif ( $step eq 'events' || $submit_events ) {
        return $self->configure_events();
    }
    else {
        my $template = $self->get_template( { file => 'configure.tt' } );
        $template->param(
            op       => $op,
            language => C4::Languages::getlanguage($cgi) || 'en',
            mbf_path => abs_path( $self->mbf_path('translations') ),
        );
        return $self->output_html( $template->output() );
    }
}

## This is the 'install' method. Any database tables or other setup that should
## be done when the plugin if first installed should be executed in this method.
## The installation method should always return true if the installation succeeded
## or false if it failed.
sub install() {
    my ( $self, $args ) = @_;

    my $dbh                 = C4::Context->dbh;
    my $target_groups_table = $self->get_qualified_table_name('target_groups');
    my $locations_table     = $self->get_qualified_table_name('locations');
    my $event_types_table   = $self->get_qualified_table_name('event_types');
    my $events_table        = $self->get_qualified_table_name('events');

    my @statements = (
        <<~"STATEMENT",
            CREATE TABLE IF NOT EXISTS $target_groups_table (
                `id` VARCHAR(16) NOT NULL,
                `name` VARCHAR(255) DEFAULT '' COMMENT 'group from target_group table or any string',
                `min_age` TINYINT(255) unsigned DEFAULT '0' COMMENT 'lower age boundary of group',
                `max_age` TINYINT(255) unsigned DEFAULT '255' COMMENT 'upper age boundary for group',
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB;
        STATEMENT
        <<~"STATEMENT",
            CREATE TABLE IF NOT EXISTS $locations_table (
                `id` VARCHAR(16) NOT NULL,
                `street` VARCHAR(255) DEFAULT '' COMMENT 'street address',
                `number` VARCHAR(255) DEFAULT '' COMMENT 'streetnumber',
                `city` VARCHAR(255) DEFAULT '' COMMENT 'city',
                `zip` VARCHAR(255) DEFAULT '' COMMENT 'zip code',
                `country` VARCHAR(255) DEFAULT 'GERMANY' COMMENT 'country',
                `name` VARCHAR(255) DEFAULT '' COMMENT 'alphanumeric identifier, e.g. name of the place',
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB;
        STATEMENT
        <<~"STATEMENT",
            CREATE TABLE IF NOT EXISTS $event_types_table (
                `id` VARCHAR(16) NOT NULL,
                `name` VARCHAR(255) DEFAULT '' COMMENT 'alphanumeric identifier, e.g. name of the template',
                `branch` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'a branch id from the branches table',
                `target_group` VARCHAR(16) DEFAULT '' COMMENT 'a target group id from the target groups table',
                `max_age` TINYINT unsigned DEFAULT NULL COMMENT 'maximum age requirement',
                `min_age` TINYINT unsigned DEFAULT NULL COMMENT 'minimum age requirement',
                `open_registration` TINYINT(1) DEFAULT '0' COMMENT 'is the registration to non-patrons via email',
                `max_participants` SMALLINT unsigned DEFAULT NULL COMMENT 'maximum allowed number of participants',
                `fee` SMALLINT unsigned DEFAULT NULL COMMENT 'fee for an event',
                `description` TEXT(65535) DEFAULT '' COMMENT 'what is happening',
                `image` INT(10) DEFAULT NULL COMMENT 'image from kohas image management',
                `location` VARCHAR(16) DEFAULT '' COMMENT 'id of a location from the locations table',
                PRIMARY KEY (`id`),
                FOREIGN KEY (`branch`) REFERENCES branches(`branchcode`),
                FOREIGN KEY (`target_group`) REFERENCES $target_groups_table(`id`),
                FOREIGN KEY (`image`) REFERENCES uploaded_files(`id`)
            ) ENGINE = INNODB;
        STATEMENT
        <<~"STATEMENT",
            CREATE TABLE IF NOT EXISTS $events_table (
                `id` TINYINT(16) NOT NULL AUTO_INCREMENT,
                `name` VARCHAR(255) DEFAULT '' COMMENT 'alphanumeric identifier, e.g. name of the event',
                `event_type` VARCHAR(16) DEFAULT '' COMMENT 'the event type id from the event types table',
                `branch` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'a branch id from the branches table',
                `target_group` VARCHAR(16) DEFAULT '' COMMENT 'a target group id from the target groups table',
                `max_age` TINYINT unsigned DEFAULT NULL COMMENT 'maximum age requirement',
                `min_age` TINYINT unsigned DEFAULT NULL COMMENT 'minimum age requirement',
                `open_registration` TINYINT(1) DEFAULT '0' COMMENT 'is the registration to non-patrons via email',
                `max_participants` SMALLINT unsigned DEFAULT NULL COMMENT 'maximum allowed number of participants',
                `fee` SMALLINT unsigned DEFAULT NULL COMMENT 'fee for an event',
                `location` VARCHAR(16) DEFAULT '' COMMENT 'id of a location from the locations table',
                `description` TEXT(65535) DEFAULT '' COMMENT 'whats happening',
                `image` INT(10) DEFAULT NULL COMMENT 'image from kohas image management',
                `start_time` DATETIME DEFAULT NULL COMMENT 'date and time an event begins on',
                `end_time` DATETIME DEFAULT NULL COMMENT 'date and time an event ends on',
                `link_to_registration` TEXT(65535) DEFAULT '' COMMENT 'link to a local or an external page with details',
                PRIMARY KEY (`id`),
                FOREIGN KEY (`branch`) REFERENCES branches(`branchcode`),
                FOREIGN KEY (`event_type`) REFERENCES $event_types_table(`id`),
                FOREIGN KEY (`target_group`) REFERENCES $target_groups_table(`id`),
                FOREIGN KEY (`image`) REFERENCES uploaded_files(`id`)
            ) ENGINE=InnoDB;
        STATEMENT
    );

    for my $statement (@statements) {
        my $sth = $dbh->prepare($statement);
        $sth->execute;
    }

    return 1;
}

## This is the 'upgrade' method. It will be triggered when a newer version of a
## plugin is installed over an existing older version of a plugin
sub upgrade {
    my ( $self, $args ) = @_;

    my $dt = dt_from_string();
    $self->store_data( { last_upgraded => $dt->ymd(q{-}) . q{ } . $dt->hms(q{:}) } );

    return 1;
}

## This method will be run just before the plugin files are deleted
## when a plugin is uninstalled. It is good practice to clean up
## after ourselves!
sub uninstall() {
    my ( $self, $args ) = @_;

    my $dbh = C4::Context->dbh;

    my @tables = (
        $self->get_qualified_table_name('events'),        $self->get_qualified_table_name('event_types'),
        $self->get_qualified_table_name('target_groups'), $self->get_qualified_table_name('locations'),
    );

    for my $table (@tables) {
        my $sth = $dbh->prepare(qq{DROP TABLE IF EXISTS $table });
        $sth->execute;
    }

    return 1;

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
    my ($self) = @_;

    return 'eventmanagement';
}

sub static_routes {
    my ( $self, $args ) = @_;

    my $spec_str = $self->mbf_read('staticapi.json');
    my $spec     = decode_json($spec_str);

    return $spec;
}

1;
