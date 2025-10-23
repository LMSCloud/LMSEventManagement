package Koha::Plugin::Com::LMSCloud::EventManagement;

no warnings 'redefine';

## It's good practice to use Modern::Perl
use Modern::Perl;
use utf8;

## Required for all plugins
use base qw(Koha::Plugins::Base);

## We will also need to include any Koha libraries we want to access
use C4::Auth      qw( get_template_and_user );
use C4::Context   ();
use C4::Languages ();

use Koha::Account        ();
use Koha::Account::Lines ();
use Koha::Database       ();
use Koha::DateUtils      qw( dt_from_string );
use Koha::Patrons        ();
use Koha::Schema         ();

use Carp             qw( carp croak );
use Cwd              qw( abs_path );
use English          qw(-no_match_vars);
use JSON::MaybeXS    ();
use Module::Metadata ();
use Mojo::JSON       qw( decode_json );
use Readonly         qw( Readonly );
use Try::Tiny        qw( catch try );

use Koha::Plugin::Com::LMSCloud::Util::MigrationHelper ();
use Koha::Plugin::Com::LMSCloud::Util::Pages           qw( create_opac_page delete_opac_page page_exists update_opac_page );

Readonly my $TINYINT_UPPER_BOUNDARY => 255;

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
our $VERSION         = '2.8.2';
our $MINIMUM_VERSION = '22.11';

## Here is our metadata, some keys are required, some are optional
our $METADATA = {
    name            => 'LMSEventManagement',
    author          => 'LMSCloud GmbH',
    date_authored   => '2021-10-15',
    date_updated    => '2025-10-22',
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
        my $account = Koha::Account->new( { patron_id => $borrowernumber } );
        my @accountlines =
            Koha::Account::Lines->search( { accountlines_id => { -in => \@accountline_ids } } )->as_list();
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

    return q{<script type="module" src="/api/v1/contrib/eventmanagement/static/dist/opac-widget.js"></script>};
}

sub opac_js {
    my ($self) = @_;

    my $widget_enabled = $self->retrieve_data('widget_enabled')     || 0;
    my $auto_inject    = $self->retrieve_data('widget_auto_inject') || 1;

    if ( $widget_enabled != 1 ) {
        return q{};
    }
    if ( $auto_inject != 1 ) {
        return q{};
    }

    return q{<script type="text/javascript" src="/api/v1/contrib/eventmanagement/static/js/opac-widget-inject.js"></script>};
}

sub intranet_head {
    my ($self) = @_;

    return q{};

}

sub intranet_js {
    my ($self) = @_;

    return q{};

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
        q{opac-widget} => sub {
            $template = $self->get_template( { file => 'views/configuration/opac-widget.tt' } );

            return $self->output_html( $template->output() );
        },

    };

    return $responses->{$op}();
}

## Helper method to ensure all expected settings exist with defaults
## This is called during both install and upgrade to handle new settings
sub _ensure_settings_exist {
    my ($self) = @_;

    my $json = JSON::MaybeXS->new->utf8->allow_nonref;

    my $default_settings = {
        opac_filters_age_enabled                    => 0,
        opac_filters_registration_and_dates_enabled => 0,
        opac_filters_fee_enabled                    => 0,
        widget_enabled                              => 0,
        widget_auto_inject                          => 1,
        widget_title                                => q{},
        widget_display_mode                         => 'count',
        widget_layout                               => 'vertical',
        widget_event_count                          => '5',
        widget_time_period                          => '14',
        widget_selected_events                      => '[]',
        widget_all_events_text                      => q{},
    };

    for my $setting_key ( keys %{$default_settings} ) {
        my $existing_value = $self->retrieve_data($setting_key);
        if ( !defined $existing_value ) {

            # JSON-encode the value before storing (consistent with Settings controller)
            my $json_value = $json->encode( $default_settings->{$setting_key} );
            $self->store_data( { $setting_key => $json_value } );
        }
    }

    return 1;
}

sub install() {
    my ( $self, $args ) = @_;

    return try {

        # We have to go the manual route because $self->bundle_path is undef at this point
        my $file       = __FILE__;
        my $bundle_dir = $file;
        $bundle_dir =~ s/[.]pm$//smx;

        my $bundle_path = $bundle_dir;

        my $migration_helper = Koha::Plugin::Com::LMSCloud::Util::MigrationHelper->new(
            {   table_name_mappings => {
                    target_groups_table                => $self->get_qualified_table_name('target_groups'),
                    locations_table                    => $self->get_qualified_table_name('locations'),
                    event_types_table                  => $self->get_qualified_table_name('event_types'),
                    events_table                       => $self->get_qualified_table_name('events'),
                    event_target_group_fees_table      => $self->get_qualified_table_name('e_tg_fees'),
                    event_type_target_group_fees_table => $self->get_qualified_table_name('et_tg_fees'),
                },
                bundle_path => $bundle_path,
            }
        );

        $self->_ensure_settings_exist();

        my $is_success = $migration_helper->install( { plugin => $self } );
        if ( !$is_success ) {
            croak 'Migration failed';
        }

        # Create OPAC page for events
        my $page_content = $self->mbf_read('events.html');
        my $page_id      = create_opac_page(
            {   code    => 'lmscloud-eventmanagement',
                title   => 'Events',
                content => $page_content,
                lang    => 'default',
            }
        );

        if ( !$page_id ) {
            carp 'Failed to create OPAC page for events';
        }

        return 1;
    }
    catch {
        my $error = $_;
        carp "INSTALL ERROR: $error";

        return 0;
    };
}

sub upgrade {
    my ( $self, $args ) = @_;

    # We have to go the manual route because $self->bundle_path is undef at this point
    my $file       = __FILE__;
    my $bundle_dir = $file;
    $bundle_dir =~ s/[.]pm$//smx;

    my $bundle_path = $bundle_dir;

    return try {
        my $migration_helper = Koha::Plugin::Com::LMSCloud::Util::MigrationHelper->new(
            {   table_name_mappings => {
                    target_groups_table                => $self->get_qualified_table_name('target_groups'),
                    locations_table                    => $self->get_qualified_table_name('locations'),
                    event_types_table                  => $self->get_qualified_table_name('event_types'),
                    events_table                       => $self->get_qualified_table_name('events'),
                    event_target_group_fees_table      => $self->get_qualified_table_name('e_tg_fees'),
                    event_type_target_group_fees_table => $self->get_qualified_table_name('et_tg_fees'),
                },
                bundle_path => $bundle_path,
            }
        );

        my $is_success = $migration_helper->upgrade( { plugin => $self } );
        if ( !$is_success ) {
            croak 'Migration failed';
        }

        # Ensure all settings exist with defaults for upgrades
        $self->_ensure_settings_exist();

        # Update or create OPAC page for events
        my $page_content = $self->mbf_read('events.html');

        if ( page_exists( { code => 'lmscloud-eventmanagement', lang => 'default' } ) ) {

            # Update existing page
            my $updated = update_opac_page(
                {   code    => 'lmscloud-eventmanagement',
                    title   => 'Events',
                    content => $page_content,
                    lang    => 'default',
                }
            );

            if ( !$updated ) {
                carp 'Failed to update OPAC page for events during upgrade';
            }
        }
        else {
            # Create new page
            my $page_id = create_opac_page(
                {   code    => 'lmscloud-eventmanagement',
                    title   => 'Events',
                    content => $page_content,
                    lang    => 'default',
                }
            );

            if ( !$page_id ) {
                carp 'Failed to create OPAC page for events during upgrade';
            }
        }

        my $dt = dt_from_string();
        $self->store_data( { last_upgraded => $dt->ymd(q{-}) . q{ } . $dt->hms(q{:}) } );

        return 1;
    }
    catch {
        my $error = $_;
        carp "UPGRADE ERROR: $error";

        return 0;
    };
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

    # Remove OPAC page for events
    delete_opac_page(
        {   code => 'lmscloud-eventmanagement',
            lang => 'default',
        }
    );

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
