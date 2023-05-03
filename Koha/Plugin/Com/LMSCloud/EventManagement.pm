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

use GD::Image;
use Cwd qw(abs_path);
use LWP::UserAgent;
use MARC::Record;
use Mojo::JSON qw(decode_json);
use URI::Escape qw(uri_unescape);
use Try::Tiny;
use Carp;
use MIME::Base64;

use Readonly;
Readonly my $TINYINT_UPPER_BOUNDARY => 255;

no if ( $PERL_VERSION >= 5.018 ), 'warnings' => 'experimental';

use Module::Metadata;
use Koha::Schema;

BEGIN {
    my $path = Module::Metadata->find_module_by_name(__PACKAGE__);
    $path =~ s{[.]pm$}{/lib}xms;
    unshift @INC, $path;

    require Koha::LMSCloud::EventManagement::Events;
    require Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEvent;
    Koha::Schema->register_class( KohaPluginComLmscloudEventmanagementEvent => 'Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEvent' );

    require Koha::LMSCloud::EventManagement::EventTypes;
    require Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEventType;
    Koha::Schema->register_class( KohaPluginComLmscloudEventmanagementEventType => 'Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEventType' );

    require Koha::LMSCloud::EventManagement::Locations;
    require Koha::Schema::Result::KohaPluginComLmscloudEventmanagementLocation;
    Koha::Schema->register_class( KohaPluginComLmscloudEventmanagementLocation => 'Koha::Schema::Result::KohaPluginComLmscloudEventmanagementLocation' );

    require Koha::LMSCloud::EventManagement::TargetGroups;
    require Koha::Schema::Result::KohaPluginComLmscloudEventmanagementTargetGroup;
    Koha::Schema->register_class( KohaPluginComLmscloudEventmanagementTargetGroup => 'Koha::Schema::Result::KohaPluginComLmscloudEventmanagementTargetGroup' );

    require Koha::Schema::Result::KohaPluginComLmscloudEventmanagementETgFee;
    require Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEtTgFee;
    Koha::Schema->register_class( KohaPluginComLmscloudEventmanagementETgFee => 'Koha::Schema::Result::KohaPluginComLmscloudEventmanagementETgFee' );

    require Koha::LMSCloud::EventManagement::Event::TargetGroup::Fees;
    require Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fees;
    Koha::Schema->register_class( KohaPluginComLmscloudEventmanagementEtTgFee => 'Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEtTgFee' );

    Koha::Database->schema( { new => 1 } );
}

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

    my $template = undef;
    my $query    = $self->{'cgi'};
    my $op       = $query->param('op') || q{};

    my $responses = {
        q{} => sub {
            $template = $self->get_template( { file => 'views/tool/events.tt' } );

            return $self->output_html( $template->output() );
        },
        q{images} => sub {
            $template = $self->get_template( { file => 'views/tool/images.tt' } );
            $template->param(
                LANG    => C4::Languages::getlanguage($query) || 'en',
                LOCALES => $self->bundle_path . '/locales/',
            );

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

    return <<~'JS';
        <script>
            $(document).ready(function () {
                // Check if a flag 'formSubmitted' exists in sessionStorage
                const formSubmitted = sessionStorage.getItem("formSubmitted");

                if (formSubmitted) {
                    // Get the current URL
                    const currentUrl = window.location.href;

                    // Check if the URL contains 'upload.pl'
                    if (currentUrl.indexOf("upload.pl") !== -1) {
                        // Send a message to the parent window (the opener)
                        if (window.opener) {
                            window.opener.postMessage("reloaded", "*");
                        }

                        // Close the current window
                        window.close();
                    }

                    // Clear the formSubmitted flag from sessionStorage
                    sessionStorage.removeItem("formSubmitted");
                }
            });

            // Add a submit event listener to your form
            $("form").on("submit", function () {
                // Set the 'formSubmitted' flag in sessionStorage when the form is submitted
                sessionStorage.setItem("formSubmitted", "true");
            });

        </script>
    JS

}

sub configure {
    my ( $self, $args ) = @_;

    my $template = undef;
    my $cgi      = $self->{'cgi'};
    my $op       = $cgi->param('op') || q{};

    my $responses = {
        q{} => sub {
            $template = $self->get_template( { file => 'views/configuration/settings.tt' } );

            return $self->output_html( $template->output() );
        },
        q{event-types} => sub {
            $template = $self->get_template( { file => 'views/configuration/event-types.tt' } );

            return $self->output_html( $template->output() );
        },
        q{target-groups} => sub {
            $template = $self->get_template( { file => 'views/configuration/target-groups.tt' } );

            return $self->output_html( $template->output() );
        },
        q{locations} => sub {
            $template = $self->get_template( { file => 'views/configuration/locations.tt' } );

            return $self->output_html( $template->output() );
        },

    };

    return $responses->{$op}();
}

sub install() {
    my ( $self, $args ) = @_;

    try {
        my $dbh                 = C4::Context->dbh;
        my $target_groups_table = $self->get_qualified_table_name('target_groups');
        my $locations_table     = $self->get_qualified_table_name('locations');
        my $event_types_table   = $self->get_qualified_table_name('event_types');
        my $events_table        = $self->get_qualified_table_name('events');

        # Spelling those tables out exceeds the character
        # limit for table names in MySQL.
        my $event_target_group_fees_table      = $self->get_qualified_table_name('e_tg_fees');
        my $event_type_target_group_fees_table = $self->get_qualified_table_name('et_tg_fees');

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
                `name` VARCHAR(255) DEFAULT '' COMMENT 'alphanumeric identifier, e.g. name of the place',
                `street` VARCHAR(255) DEFAULT '' COMMENT 'street address',
                `number` VARCHAR(255) DEFAULT '' COMMENT 'streetnumber',
                `city` VARCHAR(255) DEFAULT '' COMMENT 'city',
                `zip` VARCHAR(255) DEFAULT '' COMMENT 'zip code',
                `country` VARCHAR(255) DEFAULT 'GERMANY' COMMENT 'country',
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB;
        STATEMENT
            <<~"STATEMENT",
            CREATE TABLE IF NOT EXISTS $event_types_table (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `name` VARCHAR(255) DEFAULT '' COMMENT 'alphanumeric identifier, e.g. name of the template',
                `min_age` TINYINT unsigned DEFAULT NULL COMMENT 'minimum age requirement',
                `max_age` TINYINT unsigned DEFAULT NULL COMMENT 'maximum age requirement',
                `max_participants` SMALLINT unsigned DEFAULT NULL COMMENT 'maximum allowed number of participants',
                `location` INT(11) DEFAULT NULL COMMENT 'id of a location from the locations table',
                `image` TEXT(65535) DEFAULT NULL COMMENT 'image from kohas image management',
                `description` TEXT COMMENT 'what is happening',
                `open_registration` TINYINT(1) DEFAULT '0' COMMENT 'is the registration to non-patrons via email',
                PRIMARY KEY (`id`)
            ) ENGINE = INNODB;
        STATEMENT
            <<~"STATEMENT",
            CREATE TABLE IF NOT EXISTS $events_table (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `name` VARCHAR(255) DEFAULT '' COMMENT 'alphanumeric identifier, e.g. name of the event',
                `event_type` INT(11) DEFAULT NULL COMMENT 'the event type id from the event types table',
                `min_age` TINYINT unsigned DEFAULT NULL COMMENT 'minimum age requirement',
                `max_age` TINYINT unsigned DEFAULT NULL COMMENT 'maximum age requirement',
                `max_participants` SMALLINT unsigned DEFAULT NULL COMMENT 'max number of participants',
                `start_time` DATETIME DEFAULT NULL COMMENT 'start time of the event',
                `end_time` DATETIME DEFAULT NULL COMMENT 'end time of the event',
                `registration_start` DATETIME DEFAULT NULL COMMENT 'start time of the registration',
                `registration_end` DATETIME DEFAULT NULL COMMENT 'end time of the registration',
                `location` INT(11) DEFAULT NULL COMMENT 'the location id from the locations table',
                `image` TEXT(65535) DEFAULT NULL COMMENT 'image from kohas image management',
                `description` TEXT(65535) DEFAULT NULL COMMENT 'description',
                `status` ENUM('pending','confirmed','canceled', 'sold_out') DEFAULT 'pending' COMMENT 'status of the event',
                `registration_link` TEXT(65535) COMMENT 'link to the registration form',
                `open_registration` TINYINT(1) DEFAULT '0' COMMENT 'is the registration to non-patrons via email',
                PRIMARY KEY (`id`),
                FOREIGN KEY (`event_type`) REFERENCES $event_types_table(`id`),
                FOREIGN KEY (`location`) REFERENCES $locations_table(`id`)
            ) ENGINE = INNODB;
        STATEMENT
            <<~"STATEMENT",
            CREATE TABLE IF NOT EXISTS $event_target_group_fees_table (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `event_id` INT(11) DEFAULT NULL COMMENT 'the event id from the events table',
                `target_group_id` INT(11) DEFAULT NULL COMMENT 'the target group id from the target groups table',
                `selected` TINYINT(1) DEFAULT '0' COMMENT 'is the target group selected for the event',
                `fee` FLOAT unsigned DEFAULT NULL COMMENT 'fee for the event',
                PRIMARY KEY (`id`),
                FOREIGN KEY (`event_id`) REFERENCES $events_table(`id`),
                FOREIGN KEY (`target_group_id`) REFERENCES $target_groups_table(`id`)
            ) ENGINE = INNODB;
        STATEMENT
            <<~"STATEMENT",
            CREATE TABLE IF NOT EXISTS $event_type_target_group_fees_table (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `event_type_id` INT(11) DEFAULT NULL COMMENT 'the event type id from the event types table',
                `target_group_id` INT(11) DEFAULT NULL COMMENT 'the target group id from the target groups table',
                `selected` TINYINT(1) DEFAULT '0' COMMENT 'is the target group selected for the event',
                `fee` FLOAT unsigned DEFAULT NULL COMMENT 'fee for the event',
                PRIMARY KEY (`id`),
                FOREIGN KEY (`event_type_id`) REFERENCES $event_types_table(`id`),
                FOREIGN KEY (`target_group_id`) REFERENCES $target_groups_table(`id`)
            ) ENGINE = INNODB;
        STATEMENT
        );

        for my $statement (@statements) {
            $dbh->do($statement);
        }

        return 1;
    }
    catch {
        my $error = $_;
        use Data::Dumper;
        carp Dumper($error);
        carp "INSTALL ERROR: $error";

        return 0;
    };

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
        $self->get_qualified_table_name('e_tg_fees'),     $self->get_qualified_table_name('events'),
        $self->get_qualified_table_name('et_tg_fees'),    $self->get_qualified_table_name('event_types'),
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
