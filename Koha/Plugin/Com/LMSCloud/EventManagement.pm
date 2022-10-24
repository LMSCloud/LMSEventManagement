package Koha::Plugin::Com::LMSCloud::EventManagement;

## It's good practice to use Modern::Perl
use Modern::Perl;
use utf8;
use 5.032;
use English qw(-no_match_vars);

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

use Readonly;
Readonly my $TINYINT_LOWER_BOUNDARY => 0;
Readonly my $TINYINT_UPPER_BOUNDARY => 255;

use Locale::Messages;
Locale::Messages->select_package('gettext_pp');

use Locale::Messages qw(:locale_h :libintl_h);
use POSIX qw(setlocale);

use Koha::Plugin::Com::LMSCloud::EventManagement::Validators qw(validate_event validate_event_type);

no if ( $PERL_VERSION >= 5.018 ), 'warnings' => 'experimental';

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
    my $op       = $cgi->param('op') || q{};

    for ($op) {
        when (q{}) {
            $template = $self->get_template( { file => 'tools/tool.tt' } );

            $template->param( events => $self->get_events(), );

            return $self->output_html( $template->output() );
        }

        when (q{choose_event_type}) {
            $template = $self->get_template( { file => 'tools/choose_event_type.tt' } );

            $template->param( event_types => $self->get_event_types(), );

            return $self->output_html( $template->output() );
        }

        when (q{add_event}) {

            # Catch non-selected event type in choose_event_type view and redirect to it
            if ( !( scalar $cgi->param('event_type_id') ) ) {
                $template = $template = $self->get_template( { file => 'tools/choose_event_type.tt' } );

                $template->param(
                    event_types => $self->get_event_types(),
                    invalid     => 1,
                );

                return $self->output_html( $template->output() );

            }

            $template = $self->get_template( { file => 'tools/add_event.tt' } );

            $template->param(
                event_type    => $self->get_event_type( scalar $cgi->param('event_type_id') ),
                branches      => Koha::Template::Plugin::Branches->all(),
                target_groups => $self->get_target_groups(),
            );

            return $self->output_html( $template->output() );
        }

        when (q{submit_add_event}) {
            my $event_is_added = $self->add_event(
                {   name              => scalar $cgi->param('name'),
                    event_type        => scalar $cgi->param('event_type'),
                    branch            => scalar $cgi->param('branch'),
                    target_group      => scalar $cgi->param('target_group'),
                    max_age           => scalar $cgi->param('max_age'),
                    open_registration => scalar $cgi->param('open_registration') eq 'on' ? 1 : 0,
                    start_time        => scalar $cgi->param('start_time'),
                    end_time          => scalar $cgi->param('end_time'),
                    max_participants  => scalar $cgi->param('max_participants'),
                    fee               => scalar $cgi->param('fee'),
                    description       => scalar $cgi->param('description'),
                    image             => scalar $cgi->param('uploaded_file_id'),
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

        when (q{edit_event}) {
            $template = $self->get_template( { file => 'tools/edit_event.tt' } );

            $template->param(
                event         => $self->get_event( scalar $cgi->param('event_id') ),
                branches      => Koha::Template::Plugin::Branches->all(),
                target_groups => $self->get_target_groups(),
            );

            return $self->output_html( $template->output() );
        }

        when (q{submit_edit_event}) {
            my $id = $cgi->param('event_id');

            my $event_is_updated = $self->update_event(
                {   id                => $id,
                    name              => scalar $cgi->param('name'),
                    event_type        => scalar $cgi->param('event_type'),
                    branch            => scalar $cgi->param('branch'),
                    target_group      => scalar $cgi->param('target_group'),
                    max_age           => scalar $cgi->param('max_age'),
                    open_registration => scalar $cgi->param('open_registration') eq 'on' ? 1 : 0,
                    start_time        => scalar $cgi->param('start_time'),
                    end_time          => scalar $cgi->param('end_time'),
                    max_participants  => scalar $cgi->param('max_participants'),
                    fee               => scalar $cgi->param('fee'),
                    description       => scalar $cgi->param('description'),
                    image             => scalar $cgi->param('uploaded_file_id'),
                }
            );

            if ($event_is_updated) {
                $self->get_template( { file => 'tools/tool.tt' } );

                $template->param( events => $self->get_events() );

                return $self->output_html( $template->output() );
            }

            $self->get_template( { file => 'tools/edit_event.tt' } );

            $template->param(
                event_type    => $self->get_event($id),
                branches      => Koha::Template::Plugin::Branches->all(),
                target_groups => $self->get_target_groups(),
            );

            return $self->output_html( $template->output() );
        }

        when (q{submit_delete_event}) {
            $template = $self->get_template( { file => 'tools/tool.tt' } );

            $self->delete_event( scalar $cgi->param('event_id') );

            $template->param( events => $self->get_events(), );

            return $self->output_html( $template->output() );
        }
    }

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

sub opac_head {
    my ($self) = @_;

    return q{};
}

sub opac_js {
    my ($self) = @_;

    return q{};

}

sub intranet_head {
    my ($self) = @_;

    return q{};

}

sub intranet_js {
    my ($self) = @_;

    return q{};

}

# TARGET GROUPS

sub add_target_group {
    my ( $self, $args ) = @_;

    my $table = $self->get_qualified_table_name('target_groups');

    my $query = qq{SELECT * FROM $table WHERE id = ?};
    my $dbh   = C4::Context->dbh;
    my $sth   = $dbh->prepare($query);

    $sth->execute( $args->{'id'} );

    my $code_exists = $sth->fetchrow_hashref();

    if ( !$code_exists ) {

        $query = qq{INSERT INTO $table (id, name};

        if ( $args->{'min_age'} ne q{} ) {
            $query = $query . q{, min_age};
        }
        if ( $args->{'max_age'} ne q{} ) {
            $query = $query . q{, max_age};
        }

        $query = $query . ") VALUES ('$args->{'id'}', '$args->{'name'}'";

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

sub get_target_group {
    my ( $self, $id ) = @_;

    my $table = $self->get_qualified_table_name('target_groups');
    my $query = qq{SELECT * FROM $table WHERE id = ?};

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute($id);

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

sub update_target_group {
    my ( $self, $args ) = @_;

    my $table     = $self->get_qualified_table_name('target_groups');
    my $statement = <<~"STATEMENT";
        UPDATE $table
        SET id = ?, name = ?, min_age = ?, max_age = ?
        WHERE id = ?;
    STATEMENT

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($statement);

    my @values = ( $args->{'id'}, $args->{'name'}, ( $args->{'min_age'} || $TINYINT_LOWER_BOUNDARY ), ( $args->{'max_age'} || $TINYINT_UPPER_BOUNDARY ), $args->{'id'} );

    my $rv = $sth->execute(@values);

    return $rv;
}

sub delete_target_group {

    #TODO: Catch failure because of foreign key constraints and inform user
    my ( $self, $id ) = @_;

    my $table = $self->get_qualified_table_name('target_groups');
    my $query = qq{DELETE FROM $table WHERE id = ?};

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute($id);

    return;
}

# EVENTS

sub add_event {
    my ( $self, $args ) = @_;

    my $table = $self->get_qualified_table_name('events');
    my $dbh   = C4::Context->dbh;

    my $src_image;

    my $query        = "INSERT INTO $table (name, event_type, branch, target_group";
    my $query_values = "VALUES ('$args->{'name'}', '$args->{'event_type'}', '$args->{'branch'}', '$args->{'target_group'}'";

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

sub get_event {
    my ( $self, $id ) = @_;

    my $table             = $self->get_qualified_table_name('events');
    my $tableeventtypes   = $self->get_qualified_table_name('event_types');
    my $tabletargetgroups = $self->get_qualified_table_name('target_groups');

    my $query = <<~"STATEMENT";
		SELECT events.*, branchcode, target_groups.name, event_types.name 
		FROM $table AS events 
		LEFT JOIN branches AS branches ON events.branch = branches.branchcode 
		LEFT JOIN $tabletargetgroups AS target_groups ON events.target_group = target_groups.id 
		LEFT JOIN $tableeventtypes AS event_types ON events.event_type = event_types.id
		WHERE events.id = $id
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

    my $events_table        = $self->get_qualified_table_name('events');
    my $event_types_table   = $self->get_qualified_table_name('event_types');
    my $target_groups_table = $self->get_qualified_table_name('target_groups');

    my $query = <<~"STATEMENT";
		SELECT events.*, branchcode, target_groups.name, event_types.name
		FROM $events_table AS events
		LEFT JOIN branches AS branches ON events.branch = branches.branchcode 
		LEFT JOIN $target_groups_table AS target_groups ON events.target_group = target_groups.id 
		LEFT JOIN $event_types_table AS event_types ON events.event_type = event_types.id
	STATEMENT

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute();

    my @events;
    while ( my $row = $sth->fetchrow_hashref() ) {
        if ( defined $row->{'image'} && $row->{'image'} != 0 ) {
            my $rec       = Koha::UploadedFiles->find( $row->{'image'} );
            my $src_image = $rec->hashvalue . '_' . $rec->filename();
            $row->{'image'} = $src_image;
        }
        else {
            $row->{'image'} = q{};
        }

        push @events, $row;
    }

    return \@events;
}

sub update_event {
    my ( $self, $args ) = @_;

    my $table     = $self->get_qualified_table_name('events');
    my $statement = <<~"STATEMENT";
        UPDATE $table
        SET id = ?,         name = ?,               event_type = ?,         branch = ?, target_group = ?,
            max_age = ?,    open_registration = ?,  max_participants = ?,   fee = ?,    description = ?,
            start_time = ?, end_time = ?,           image = ?
        WHERE id = ?;
    STATEMENT

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($statement);

    my @values = (
        $args->{'id'},
        ( $args->{'name'}              || 'NULL' ),
        ( $args->{'event_type'}        || 'NULL' ),
        ( $args->{'branch'}            || 'NULL' ),
        ( $args->{'target_group'}      || 'NULL' ),
        ( $args->{'max_age'}           || $TINYINT_UPPER_BOUNDARY ),
        ( $args->{'open_registration'} || 0 ),
        ( $args->{'max_participants'}  || 0 ),
        ( $args->{'fee'}               || 0 ),
        ( $args->{'description'}       || 'NULL' ),
        ( $args->{'start_time'}        || 'NULL' ),
        ( $args->{'end_time'}          || 'NULL' ),
        ( $args->{'image'}             || 0 ),
        $args->{'id'},
    );

    my $rv = $sth->execute(@values);

    return $rv;
}

sub delete_event {
    my ( $self, $id ) = @_;

    my $table = $self->get_qualified_table_name('events');
    my $query = qq{DELETE FROM $table WHERE id = ?};

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute($id);

    return;
}

# EVENT TYPES

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

sub get_event_type {
    my ( $self, $id ) = @_;

    my $table = $self->get_qualified_table_name('event_types');

    my $query = qq{SELECT * FROM $table WHERE id = ?};

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute($id);

    my $event_type = $sth->fetchrow_hashref();

    return $event_type;
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
        if ( defined $row->{'image'} && $row->{'image'} != 0 ) {
            my $rec       = Koha::UploadedFiles->find( $row->{'image'} );
            my $src_image = $rec->hashvalue . '_' . $rec->filename();
            $row->{'image'} = $src_image;
        }
        else {
            $row->{'image'} = q{};
        }
        push @eventtypes, $row;
    }

    return \@eventtypes;
}

sub update_event_type {
    my ( $self, $args ) = @_;

    my $table     = $self->get_qualified_table_name('event_types');
    my $statement = <<~"STATEMENT";
        UPDATE $table
        SET id = ?,                 branch = ?,             target_group = ?,       name = ?,
            max_age = ?,            open_registration = ?,  max_participants = ?,   fee = ?, description = ?, 
            image = ?
        WHERE id = ?;
    STATEMENT

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($statement);

    my @values = (
        $args->{'id'},
        ( $args->{'branch'}            || 'NULL' ),
        ( $args->{'target_group'}      || 'NULL' ),
        ( $args->{'name'}              || 'NULL' ),
        ( $args->{'max_age'}           || $TINYINT_UPPER_BOUNDARY ),
        ( $args->{'open_registration'} || 0 ),
        ( $args->{'max_participants'}  || 0 ),
        ( $args->{'fee'}               || 0 ),
        ( $args->{'description'}       || 'NULL' ),
        ( $args->{'image'}             || 0 ),
        $args->{'id'},
    );

    my $rv = $sth->execute(@values);

    return $rv;
}

sub delete_event_type {
    my ( $self, $id ) = @_;

    my $table = $self->get_qualified_table_name('event_types');
    my $query = qq{DELETE FROM $table WHERE id = ?};

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare($query);
    $sth->execute($id);

    return;
}

sub configure {
    my ( $self, $args ) = @_;

    my $cgi = $self->{'cgi'};
    my $op  = $cgi->param('op') || q{};
    my $template;

    for ($op) {
        when (q{}) {
            $template = $self->get_template( { file => 'configuration/configure.tt' } );

            return $self->output_html( $template->output() );
        }

        when (q{configure_target_groups}) {
            $template = $self->get_template( { file => 'configuration/configure_target_groups.tt' } );

            $template->param( target_groups => $self->get_target_groups(), );

            return $self->output_html( $template->output() );

        }

        when (q{add_target_group}) {
            $template = $self->get_template( { file => 'configuration/add_target_group.tt' } );

            return $self->output_html( $template->output() );
        }

        when (q{submit_add_target_group}) {
            my $id = $cgi->param('id');

            my $target_group_is_added = $self->add_target_group(
                {   id      => $id,
                    name    => scalar $cgi->param('name'),
                    min_age => scalar $cgi->param('min_age'),
                    max_age => scalar $cgi->param('max_age'),
                }
            );

            if ($target_group_is_added) {
                $template = $self->get_template( { file => 'configuration/configure_target_groups.tt' } );

                $template->param( target_groups => $self->get_target_groups(), );

                return $self->output_html( $template->output() );
            }

            $template = $self->get_template( { file => 'configuration/add_target_group.tt' } );

            $template->param(

                #TODO: Make these messages translatable with gettext
                message => "Couldn't create target group. Id: '$id' already exists.",
            );

            return $self->output_html( $template->output() );
        }

        when (q{edit_target_group}) {
            $template = $self->get_template( { file => 'configuration/edit_target_group.tt' } );

            $template->param( target_group => $self->get_target_group( scalar $cgi->param('target_group_id') ), );

            return $self->output_html( $template->output() );
        }

        when (q{submit_edit_target_group}) {
            my $id   = $cgi->param('id');
            my $name = $cgi->param('name');

            my $target_group_is_updated = $self->update_target_group(
                {   id      => $id,
                    name    => $name,
                    min_age => scalar $cgi->param('branch'),
                    max_age => scalar $cgi->param('target_group'),
                }
            );

            if ($target_group_is_updated) {
                $template = $self->get_template( { file => 'configuration/configure_target_groups.tt' } );

                $template->param( target_groups => $self->get_target_groups(), );

                return $self->output_html( $template->output() );
            }

            $template = $self->get_template( { file => 'configuration/edit_target_group.tt' } );

            $template->param(
                target_group => $self->get_target_group($id),
                message      => "Updating $name failed: $target_group_is_updated",
            );

            return $self->output_html( $template->output() );
        }

        when (q{delete_target_group}) {
            $self->delete_target_group( scalar $cgi->param('target_group_id') );

            $template = $self->get_template( { file => 'configuration/configure_target_groups.tt' } );

            $template->param( target_groups => $self->get_target_groups(), );

            return $self->output_html( $template->output() );
        }

        when (q{configure_event_types}) {
            $template = $self->get_template( { file => 'configuration/configure_event_types.tt' } );

            $template->param( event_types => $self->get_event_types(), );

            return $self->output_html( $template->output() );
        }

        when (q{add_event_type}) {
            $template = $self->get_template( { file => 'configuration/add_event_type.tt' } );

            $template->param(
                event_types   => $self->get_event_types(),
                branches      => Koha::Template::Plugin::Branches->all(),
                target_groups => $self->get_target_groups(),
            );

            return $self->output_html( $template->output() );
        }

        when (q{submit_add_event_type}) {
            my $event_type_is_added = $self->add_event_type(
                {   id                => scalar $cgi->param('id'),
                    name              => scalar $cgi->param('name'),
                    branch            => scalar $cgi->param('branch'),
                    target_group      => scalar $cgi->param('target_group'),
                    max_age           => scalar $cgi->param('max_age'),
                    open_registration => scalar $cgi->param('open_registration') eq 'on' ? 1 : 0,
                    max_participants  => scalar $cgi->param('max_participants'),
                    fee               => scalar $cgi->param('fee'),
                    description       => scalar $cgi->param('description'),
                    image             => scalar $cgi->param('uploaded_file_id'),
                }
            );

            if ( $event_type_is_added->{'ok'} ) {
                $template = $self->get_template( { file => 'configuration/configure_event_types.tt' } );

                $template->param( event_types => $self->get_event_types(), );

                return $self->output_html( $template->output() );
            }

            $template = $self->get_template( { file => 'configuration/add_event_type.tt' } );

            $template->param( event_types => $self->get_event_types(), );

            return $self->output_html( $template->output() );
        }

        when (q{edit_event_type}) {
            $template = $self->get_template( { file => 'configuration/edit_event_type.tt' } );

            $template->param(
                event_type    => $self->get_event_type( scalar $cgi->param('event_type_id') ),
                branches      => Koha::Template::Plugin::Branches->all(),
                target_groups => $self->get_target_groups(),
            );

            return $self->output_html( $template->output() );
        }

        when (q{submit_edit_event_type}) {
            my $id = $cgi->param('id');

            my $event_type_is_updated = $self->update_event_type(
                {   id                => $id,
                    name              => scalar $cgi->param('name'),
                    branch            => scalar $cgi->param('branch'),
                    target_group      => scalar $cgi->param('target_group'),
                    max_age           => scalar $cgi->param('max_age'),
                    open_registration => scalar $cgi->param('open_registration') eq 'on' ? 1 : 0,
                    max_participants  => scalar $cgi->param('max_participants'),
                    fee               => scalar $cgi->param('fee'),
                    description       => scalar $cgi->param('description'),
                    image             => scalar $cgi->param('uploaded_file_id'),
                }
            );

            if ($event_type_is_updated) {
                $template = $self->get_template( { file => 'configuration/configure_event_types.tt' } );

                $template->param( event_types => $self->get_event_types(), );

                return $self->output_html( $template->output() );
            }

            $template = $self->get_template( { file => 'configuration/edit_event_type.tt' } );

            $template->param(
                event_type    => $self->get_event_type($id),
                branches      => Koha::Template::Plugin::Branches->all(),
                target_groups => $self->get_target_groups(),
            );

            return $self->output_html( $template->output() );
        }

        when (q{delete_event_type}) {
            $self->delete_event_type( scalar $cgi->param('event_type_id') );

            $template = $self->get_template( { file => 'configuration/configure_event_types.tt' } );

            $template->param( event_types => $self->get_event_types(), );

            return $self->output_html( $template->output() );
        }

    }

    return $self->output_html( $template->output() );
}

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
            ) ENGINE=InnoDB;
        STATEMENT
    );

    for my $statement (@statements) {
        my $sth = $dbh->prepare($statement);
        $sth->execute;
    }

    return 1;
}

sub upgrade {
    my ( $self, $args ) = @_;

    my $dt = dt_from_string();
    $self->store_data( { last_upgraded => $dt->ymd(q{-}) . q{ } . $dt->hms(q{:}) } );

    return 1;
}

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
