#!/usr/bin/env perl

use strict;
use warnings;
use feature 'signatures';
use lib './local/lib/perl5';
use lib './lib';

use Carp         qw( croak );
use DateTime     ();
use Getopt::Long qw( GetOptions );
use JSON         qw( decode_json encode_json );
use List::Util   qw( none );
use Path::Tiny   qw( path );
use Readonly     qw( Readonly );

use Local::Util qw( l );

our $VERSION = '0.0.1';

Readonly my $CONST => {
    INDENTATION              => 4,
    INDEX_MAJOR              => 0,
    INDEX_MINOR              => 1,
    INDEX_PATCH              => 2,
    LENGTH_SEMVER_COMPONENTS => 3,
    OFFSET_DATE_UPDATED      => 5,
    OFFSET_VERSION           => 10,
};

my $opts = {
    version => undef,
    type    => 'patch',
    times   => 1,
    name    => undef,
};

if (!GetOptions(
        'version=s' => \$opts->{'version'},
        'type=s'    => \$opts->{'type'},
        'times=i'   => \$opts->{'times'},
        'name=s'    => \$opts->{'name'},
    )
    )
{
    croak "Error in command line arguments\n";
}

sub main($opts) {    ## no critic qw(ValuesAndExpressions::RequireInterpolationOfMetachars)
    my ( $version, $name, $type, $times, ) = @{$opts}{qw(version name type times)};
    if ( !$version ) {
        return;
    }

    my $components = [ split /[.]/smx, $version ];
    if ( scalar @{$components} != $CONST->{'LENGTH_SEMVER_COMPONENTS'} ) {
        return;
    }

    $components = _incremented_components( $components, $type, $times );

    my $new_version = _join_components($components);
    if ( !_update_dotenv($new_version) ) {
        l( 'error', 'Updating PLUGIN_VERSION in .env failed' ) and return;
    }

    if ( !_update_package_json($new_version) ) {
        l( 'error', 'Updating version in package.json failed' ) and return;
    }

    if ( !_update_base_module( $new_version, $name ) ) {
        l( 'error', 'Updating version in package declaration or metadata in base module failed' ) and return;
    }

    return;
}

sub _incremented_components( $components, $type, $times ) {    ## no critic qw(ValuesAndExpressions::RequireInterpolationOfMetachars)
    my $clone = [ $components->@* ];
    if ( none { $type eq $_ } qw(major minor patch) ) {
        l( 'error', "unrecognized type: $type" );
        return;
    }

    my $index = $CONST->{ join q{_}, 'INDEX', uc $type };
    while ( $times-- ) {
        $clone->[$index]++;
    }

    l( 'info', join q{ }, "incrementing $type version from", _join_components($components), 'to', _join_components($clone) );

    return $clone;
}

sub _update_dotenv($new_version) {    ## no critic qw(ValuesAndExpressions::RequireInterpolationOfMetachars)
    my $dotenv = path('.env');
    if ( !$dotenv->exists ) {
        l( 'error', '.env not found, aborting...' ) and return 0;
    }

    my $lines           = [ $dotenv->lines_utf8( { chomp => 1 } ) ];
    my $version_updated = 0;
    for my $line ( $lines->@* ) {
        if ( $line =~ /^PLUGIN_VERSION=/smx ) {
            $line            = "PLUGIN_VERSION=$new_version";
            $version_updated = 1;
        }

        if ( $version_updated and $line =~ /^PLUGIN_DATE_UPDATED=/smx ) {
            $line = join q{}, 'PLUGIN_DATE_UPDATED=', DateTime->now->ymd(q{-});
        }
    }

    return $dotenv->spew_utf8( join "\n", $lines->@*, "\n" );
}

sub _update_package_json($new_version) {    ## no critic qw(ValuesAndExpressions::RequireInterpolationOfMetachars)
    my $package_json = path('package.json');
    if ( !$package_json->exists ) {
        l( 'info', 'package.json not found, skipping...' ) and return 1;
    }

    my $contents = $package_json->slurp_utf8;
    my $data     = decode_json($contents);

    $data->{version} = $new_version;
    $contents = encode_json($data);

    return $package_json->spew_utf8($contents);
}

sub _update_base_module( $new_version, $name ) {    ## no critic qw(ValuesAndExpressions::RequireInterpolationOfMetachars)
    my $base_module = path( join( q{/}, split /::/smx, $name ) . '.pm' );
    if ( !$base_module->exists ) {
        l( 'error', 'Base module not found' ) and return 0;
    }

    my $lines       = [ $base_module->lines_utf8( { chomp => 1 } ) ];
    my $in_metadata = 0;
    for my $line ( $lines->@* ) {

        # Update the version in the package declaration
        if ( $line =~ /^package\s+([[:alnum:]:]+)\s+v([\d]+[.][\d]+[.][\d]+);/smx ) {
            my $package_name = $1;
            $line = "package $package_name v$new_version;";
        }

        # Detect if we are inside the $metadata block
        if ( $line =~ /\$metadata\s*=\s*{/smx ) {
            $in_metadata = 1;
        }

        # Only handle lines inside $metadata block
        if ($in_metadata) {
            if ( $line =~ /\s*'?version'?\s*=>\s*'[\d]+[.][\d]+[.][\d]+',?/smx ) {
                $line = join q{}, q{ } x $CONST->{'INDENTATION'}, q{'version'}, q{ } x $CONST->{'OFFSET_VERSION'},
                    qq{=> '$new_version',};
            }

            if ( $line =~ /\s*'?date_updated'?\s*=>\s*'[\d]+-[\d]+-[\d]+',?/smx ) {
                my $date = DateTime->now->ymd(q{-});
                $line = join q{}, q{ } x $CONST->{'INDENTATION'}, q{'date_updated'}, q{ } x $CONST->{'OFFSET_DATE_UPDATED'},
                    qq{=> '$date',};
            }

            if ( $line =~ /\s*};\s*/smx ) {
                $in_metadata = 0;    # Ensure we stop processing if we hit the end of $metadata
            }
        }

    }

    return $base_module->spew_utf8( join "\n", $lines->@* );
}

sub _join_components($components) {    ## no critic qw(ValuesAndExpressions::RequireInterpolationOfMetachars)
    return join q{.}, $components->@*;
}

main($opts);
