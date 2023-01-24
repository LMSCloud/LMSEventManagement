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
Readonly my $TINYINT_UPPER_BOUNDARY => 255;

use Locale::Messages;
Locale::Messages->select_package('gettext_pp');

use Locale::Messages qw(:locale_h :libintl_h);
use POSIX qw(setlocale);

use Koha::Plugin::Com::LMSCloud::EventManagement::Validators qw(validate_event validate_event_type);

no if ( $PERL_VERSION >= 5.018 ), 'warnings' => 'experimental';

## Here we set our plugin version
our $VERSION         = '1.3.0';
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

    my $responses = {
        q{} => sub {
            $template = $self->get_template( { file => 'tools/tool.tt' } );

            $template->param( events => $self->get_events(), );

            return $self->output_html( $template->output() );
        },

        q{choose_event_type} => sub {
            $template = $self->get_template( { file => 'tools/choose_event_type.tt' } );

            $template->param( event_types => $self->get_event_types(), );

            return $self->output_html( $template->output() );
        },

        q{add_event} => sub {

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
        },

        q{submit_add_event} => sub {
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

        },

        q{edit_event} => sub {
            $template = $self->get_template( { file => 'tools/edit_event.tt' } );

            $template->param(
                event         => $self->get_event( scalar $cgi->param('event_id') ),
                branches      => Koha::Template::Plugin::Branches->all(),
                target_groups => $self->get_target_groups(),
            );

            return $self->output_html( $template->output() );
        },

        q{submit_edit_event} => sub {
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
        },

        q{submit_delete_event} => sub {
            $template = $self->get_template( { file => 'tools/tool.tt' } );

            $self->delete_event( scalar $cgi->param('event_id') );

            $template->param( events => $self->get_events(), );

            return $self->output_html( $template->output() );
        },

    };

    return $responses->{$op}();
}

sub opac_online_payment {
    my ( $self, $args ) = @_;

    return $self->retrieve_data('enable_opac_payments') eq 'Yes';
}

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
        my $statement = <<~"STATEMENT";
            INSERT INTO $table (
                id,     name,   min_age,    max_age
            ) VALUES (
                ?,      ?,      ?,           ?
            );
        STATEMENT

        my @values = (

            # Required in FE
            $args->{'id'},
            $args->{'name'},

            # Needs defaults, optional
            ( $args->{'min_age'} || 0 ),
            ( $args->{'max_age'} || $TINYINT_UPPER_BOUNDARY ),
        );

        $sth = $dbh->prepare($statement);
        my $rv = $sth->execute(@values);

        return {
            ok    => 1,
            value => $rv,
        };
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

    my @values = (

        # Required in FE
        $args->{'id'}, $args->{'name'},

        # Needs defaults, optional
        ( $args->{'min_age'} || 0 ), ( $args->{'max_age'} || $TINYINT_UPPER_BOUNDARY ),

        # WHERE value
        $args->{'id'},
    );

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

    my $rv = $sth->execute($id);

    return $rv;
}

# EVENTS

sub add_event {
    my ( $self, $args ) = @_;

    my $table = $self->get_qualified_table_name('events');
    my $dbh   = C4::Context->dbh;

    my $statement = <<~"STATEMENT";
        INSERT INTO $table (
            name,           event_type,         branch,             target_group, 
            max_age,        open_registration,  max_participants,   fee,
            description,    start_time,         end_time,           image   
        ) VALUES (
            ?,              ?,                  ?,                  ?,
            ?,              ?,                  ?,                  ?,
            ?,              ?,                  ?,                  ?
        );
    STATEMENT

    my @values = (

        # Required in FE
        $args->{'name'},
        $args->{'event_type'},
        $args->{'branch'},
        $args->{'target_group'},

        # Needs defaults, optional
        ( $args->{'max_age'}           || $TINYINT_UPPER_BOUNDARY ),
        ( $args->{'open_registration'} || 0 ),
        ( $args->{'max_participants'}  || undef ),
        ( $args->{'fee'}               || 0 ),
        ( $args->{'description'}       || undef ),
        ( $args->{'start_time'}        || undef ),
        ( $args->{'end_time'}          || undef ),
        ( $args->{'image'}             || undef ),
    );

    my $sth = $dbh->prepare($statement);
    my $rv  = $sth->execute(@values);

    return $rv;
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
        my $rec       = Koha::UploadedFiles->find( $event->{'imageid'} );
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

        # Required in FE
        $args->{'id'},
        $args->{'name'},
        $args->{'event_type'},
        $args->{'branch'},
        $args->{'target_group'},

        # Needs defaults, optional
        ( $args->{'max_age'}           || $TINYINT_UPPER_BOUNDARY ),
        ( $args->{'open_registration'} || 0 ),
        ( $args->{'max_participants'}  || undef ),
        ( $args->{'fee'}               || 0 ),
        ( $args->{'description'}       || undef ),
        ( $args->{'start_time'}        || undef ),
        ( $args->{'end_time'}          || undef ),
        ( $args->{'image'}             || undef ),

        # WHERE value
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

    my $rv = $sth->execute($id);

    return $rv;
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
        my $statement = <<~"STATEMENT";
            INSERT INTO $table (
                id,             name,               branch,             target_group,
                max_age,        open_registration,  max_participants,   fee,
                description,    image
            ) VALUES (
                ?,              ?,                  ?,                  ?,
                ?,              ?,                  ?,                  ?, 
                ?,              ?
            );
        STATEMENT

        my @values = (

            # Required in FE
            $args->{'id'},
            $args->{'name'},
            $args->{'branch'},
            $args->{'target_group'},

            # Needs defaults, optional
            ( $args->{'max_age'}           || $TINYINT_UPPER_BOUNDARY ),
            ( $args->{'open_registration'} || 0 ),
            ( $args->{'max_participants'}  || undef ),
            ( $args->{'fee'}               || 0 ),
            ( $args->{'description'}       || undef ),
            ( $args->{'image'}             || undef ),
        );

        $sth = $dbh->prepare($statement);

        my $rv = $sth->execute(@values);

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

        # Required in FE
        $args->{'id'},
        $args->{'branch'},
        $args->{'target_group'},
        $args->{'name'},

        # Needs defaults, optional
        ( $args->{'max_age'}           || $TINYINT_UPPER_BOUNDARY ),
        ( $args->{'open_registration'} || 0 ),
        ( $args->{'max_participants'}  || undef ),
        ( $args->{'fee'}               || 0 ),
        ( $args->{'description'}       || undef ),
        ( $args->{'image'}             || undef ),

        # WHERE value
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

    my $rv = $sth->execute($id);

    return $rv;
}

sub configure {
    my ( $self, $args ) = @_;

    my $cgi = $self->{'cgi'};
    my $op  = $cgi->param('op') || q{};
    my $template;

    my $responses = {
        q{} => sub {
            $template = $self->get_template( { file => 'configuration/configure.tt' } );

            return $self->output_html( $template->output() );
        },

        q{configure_target_groups} => sub {
            $template = $self->get_template( { file => 'configuration/configure_target_groups.tt' } );

            $template->param( target_groups => $self->get_target_groups(), );

            return $self->output_html( $template->output() );

        },

        q{add_target_group} => sub {
            $template = $self->get_template( { file => 'configuration/add_target_group.tt' } );

            return $self->output_html( $template->output() );
        },

        q{submit_add_target_group} => sub {
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
        },

        q{edit_target_group} => sub {
            $template = $self->get_template( { file => 'configuration/edit_target_group.tt' } );

            $template->param( target_group => $self->get_target_group( scalar $cgi->param('target_group_id') ), );

            return $self->output_html( $template->output() );
        },

        q{submit_edit_target_group} => sub {
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
        },

        q{delete_target_group} => sub {
            $self->delete_target_group( scalar $cgi->param('target_group_id') );

            $template = $self->get_template( { file => 'configuration/configure_target_groups.tt' } );

            $template->param( target_groups => $self->get_target_groups(), );

            return $self->output_html( $template->output() );
        },

        q{configure_event_types} => sub {
            $template = $self->get_template( { file => 'configuration/configure_event_types.tt' } );

            $template->param( event_types => $self->get_event_types(), );

            return $self->output_html( $template->output() );
        },

        q{add_event_type} => sub {
            $template = $self->get_template( { file => 'configuration/add_event_type.tt' } );

            $template->param(
                event_types   => $self->get_event_types(),
                branches      => Koha::Template::Plugin::Branches->all(),
                target_groups => $self->get_target_groups(),
            );

            return $self->output_html( $template->output() );
        },

        q{submit_add_event_type} => sub {
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
        },

        q{edit_event_type} => sub {
            $template = $self->get_template( { file => 'configuration/edit_event_type.tt' } );

            $template->param(
                event_type    => $self->get_event_type( scalar $cgi->param('event_type_id') ),
                branches      => Koha::Template::Plugin::Branches->all(),
                target_groups => $self->get_target_groups(),
            );

            return $self->output_html( $template->output() );
        },

        q{submit_edit_event_type} => sub {
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
        },

        q{delete_event_type} => sub {
            $self->delete_event_type( scalar $cgi->param('event_type_id') );

            $template = $self->get_template( { file => 'configuration/configure_event_types.tt' } );

            $template->param( event_types => $self->get_event_types(), );

            return $self->output_html( $template->output() );
        },

    };

    return $responses->{$op}();
}

sub install() {
    my ( $self, $args ) = @_;

    eval {
        my $dbh                 = C4::Context->dbh;
        my $target_groups_table = $self->get_qualified_table_name('target_groups');
        my $locations_table     = $self->get_qualified_table_name('locations');
        my $event_types_table   = $self->get_qualified_table_name('event_types');
        my $events_table        = $self->get_qualified_table_name('events');

        my @statements = (
            <<~"STATEMENT",
            CREATE TABLE IF NOT EXISTS $target_groups_table (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `name` VARCHAR(255) DEFAULT '' COMMENT 'group from target_group table or any string',
                `min_age` TINYINT(3) unsigned DEFAULT '0' COMMENT 'lower age boundary of group',
                `max_age` TINYINT(3) unsigned DEFAULT '255' COMMENT 'upper age boundary for group',
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB;
        STATEMENT
            <<~"STATEMENT",
            CREATE TABLE IF NOT EXISTS $locations_table (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
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
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `name` VARCHAR(255) DEFAULT '' COMMENT 'alphanumeric identifier, e.g. name of the template',
                `branch` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'a branch id from the branches table',
                `target_group` INT(11) DEFAULT NULL COMMENT 'a target group id from the target groups table',
                `max_age` TINYINT unsigned DEFAULT NULL COMMENT 'maximum age requirement',
                `min_age` TINYINT unsigned DEFAULT NULL COMMENT 'minimum age requirement',
                `open_registration` TINYINT(1) DEFAULT '0' COMMENT 'is the registration to non-patrons via email',
                `max_participants` SMALLINT unsigned DEFAULT NULL COMMENT 'maximum allowed number of participants',
                `fee` SMALLINT unsigned DEFAULT NULL COMMENT 'fee for an event',
                `description` TEXT COMMENT 'what is happening',
                `image` INT(10) DEFAULT NULL COMMENT 'image from kohas image management',
                `location` INT(11) DEFAULT NULL COMMENT 'id of a location from the locations table',
                PRIMARY KEY (`id`),
                FOREIGN KEY (`branch`) REFERENCES branches(`branchcode`),
                FOREIGN KEY (`target_group`) REFERENCES $target_groups_table(`id`)
            ) ENGINE = INNODB;
        STATEMENT
            <<~"STATEMENT",
            CREATE TABLE IF NOT EXISTS $events_table (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `name` VARCHAR(255) DEFAULT '' COMMENT 'alphanumeric identifier, e.g. name of the event',
                `event_type` INT(11) DEFAULT NULL COMMENT 'the event type id from the event types table',
                `location` INT(11) DEFAULT NULL COMMENT 'the location id from the locations table',
                `start_time` DATETIME DEFAULT NULL COMMENT 'start time of the event',
                `end_time` DATETIME DEFAULT NULL COMMENT 'end time of the event',
                `registration_start` DATETIME DEFAULT NULL COMMENT 'start time of the registration',
                `registration_end` DATETIME DEFAULT NULL COMMENT 'end time of the registration',
                `max_participants` SMALLINT unsigned DEFAULT NULL COMMENT 'max number of participants',
                `fee` SMALLINT unsigned DEFAULT NULL COMMENT 'fee for the event',
                `age_restriction` TINYINT unsigned DEFAULT NULL COMMENT 'minimum age requirement',
                `image` INT(10) DEFAULT NULL COMMENT 'image from kohas image management',
                `notes` TEXT(65535) DEFAULT NULL COMMENT 'notes',
                `status` ENUM('pending','approved','cancelled') DEFAULT 'pending' COMMENT 'status of the event',
                PRIMARY KEY (`id`),
                FOREIGN KEY (`event_type`) REFERENCES $event_types_table(`id`),
                FOREIGN KEY (`location`) REFERENCES $locations_table(`id`)
            ) ENGINE = INNODB;
        STATEMENT
        );

        for my $statement (@statements) {
            $dbh->do($statement);
        }

        return 1;
    };

    if ($EVAL_ERROR) {
        my $error = $EVAL_ERROR;
        use Data::Dumper;
        warn Dumper($error);
        warn "INSTALL ERROR: $error";
    }

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
