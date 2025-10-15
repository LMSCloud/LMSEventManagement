#!/usr/bin/env perl

use strict;
use warnings;
use feature 'signatures';
use lib './local/lib/perl5';
use lib './lib';

use Path::Tiny      qw( cwd path );
use Perl::Tidy      qw( perltidy );
use Readonly        qw( Readonly );
use Template        ();
use Term::Choose    qw( choose );
use Term::UI        ();
use Types::Standard qw();
use YAML::Tiny      ();

use Local::Metadata ();
use Local::Util     qw( l );

our $VERSION = '0.0.1';

Readonly my $CONST => {
    INDEX_TLD         => 2,
    INDEX_ORG         => 3,
    INDEX_PROJECT     => 4,
    LENGTH_COMPONENTS => 5
};

Readonly my $HOOKS => [
    qw(
        install
        upgrade
        uninstall
        admin
        configure
        report
        tool
        api
        static
        intranet_catalog_biblio_enhancements_toolbar_button
        intranet_catalog_biblio_tab
        intranet_head
        intranet_js
        opac_detail_xslt_variables
        opac_head
        opac_js
        opac_online_payment
        opac_results_xslt_variables
        patron_barcode_transform
        item_barcode_transform
        background_tasks
        before_send_messages
        cronjob_nightly
        to_marc
        transform_prepared_letter
    )
];

sub main() {
    my $metadata = Local::Metadata->new;
    if ( !$metadata->validate ) {
        l( 'info', 'aborting init...' ) and return;
    }

    my $cwd        = cwd;
    my $components = [ split /::/smx, $metadata->name ];
    my $name       = join q{/}, $components->@*;
    my $path       = path("$cwd/$name");
    if ( !$path->mkdir ) {
        l( 'error', "plugin path could not be created: $path" ) and return;
    }

    if ( !$path->is_dir ) {
        l( 'error', "plugin path is not a directory: $path" ) and return;
    }

    if ( $components->@* ) {
        $metadata->name( join q{ }, $components->@[ 0 .. 1, $CONST->{'INDEX_PROJECT'} ] );
    }

    my $tt = Template->new( { INCLUDE_PATH => 'templates', } );
    if ($Template::ERROR) {
        l( 'error', $Template::ERROR ) and return;
    }

    my $base  = _base_module_path( $path, $components->@[ $CONST->{'INDEX_PROJECT'} ] );
    my $hooks = [
        choose(
            $HOOKS,
            {   color => 2,
                info  =>
                    q{Please choose the hooks you'd like to use in your plugin. Some are grouped: api, opac_online_payment.},
                prompt => q{Select as many as you like with SPACE, then hit ENTER. :)}
            }
        )
    ];

    $tt->process(
        '[a].pm.tt',
        {   c        => $components->@[ $CONST->{'INDEX_TLD'} ],
            b        => $components->@[ $CONST->{'INDEX_ORG'} ],
            a        => $components->@[ $CONST->{'INDEX_PROJECT'} ],
            metadata => $metadata->stringify,
            ( $hooks->@* ? map { $_ => 1 } $hooks->@* : () )
        },
        _base_module_path( $path, $components->@[ $CONST->{'INDEX_PROJECT'} ] ),
    );
    if ( $tt->error ) {
        l( 'error', $tt->error ) and return;
    }

    my $error = perltidy( source => $base, destination => $base );
    if ($error) {
        l( 'error', $error ) and return;
    }

    my $manifest = YAML::Tiny->new( { $metadata->to_hashref->%*, module => join q{::}, $components->@* } );
    if ( !$manifest ) {
        l( 'error', 'manifest could not be generated' ) and return;
    }

    $manifest->write("$path/PLUGIN.yml");

    return;
}

sub _base_module_path( $path, $name ) {    ## no critic qw(ValuesAndExpressions::RequireInterpolationOfMetachars)
    return join q{.}, $path->sibling($name), 'pm';
}

main();
