#!/usr/bin/env perl

use strict;
use warnings;
use feature 'signatures';
use lib './local/lib/perl5';
use lib './lib';

use Carp         qw( croak );
use IPC::Open3   qw( open3 );
use JSON         qw( decode_json );
use Path::Tiny   qw( cwd path );
use Readonly     qw( Readonly );
use Symbol       qw( gensym );
use Template     ();
use Term::Choose qw(choose);
use Term::UI     ();

use Local::Metadata ();
use Local::Util     qw( l );

our $VERSION = '0.0.1';

Readonly my $CONST => { INDEX_PROJECT => 4, };

sub main($component) {    ## no critic qw(ValuesAndExpressions::RequireInterpolationOfMetachars)
    {   action => sub {
            my $tt = Template->new(
                {   INCLUDE_PATH => 'templates',
                    START_TAG    => '<%',
                    END_TAG      => '%>',
                    FILTERS      => {
                        capitalize => sub {
                            my $text = shift;
                            $text =~ s/^(\w)/\U$1/smx;
                            return $text;
                        }
                    }
                }
            );
            if ($Template::ERROR) {
                l( 'error', $Template::ERROR ) and return;
            }

            my $metadata = Local::Metadata->new;
            my $action   = choose( [qw(admin configure report tool)] );

            my $cwd        = cwd;
            my $components = [ split /::/smx, $metadata->name ];
            my $name       = join q{/}, $components->@*;
            my $path       = path("$cwd/$name");

            $tt->process(
                'sites/action.tt',
                {   a      => $components->@[-1],
                    action => $action,
                },
                "$path/$action.tt"
            );
            if ( $tt->error ) {
                l( 'error', $tt->error ) and return;
            }

            return;
        },
        node => sub {
            my $metadata = Local::Metadata->new;

            my $j     = JSON->new;
            my $error = gensym;
            my $pid   = open3( undef, undef, $error, 'npm', 'init', '-y' );

            waitpid $pid, 0;

            while (<$error>) {
                print or croak;
            }

            my $path = path('package.json');
            if ( !$path->exists ) {
                l( 'error', 'package.json was not created by `npm init`' );
            }

            my $json = $j->utf8->decode( $path->slurp_utf8 );
            if ( $metadata->name ) {
                $json->{'name'} = lc join q{-}, [ split /::/smx, $metadata->name ]->@[ 0 .. 1, $CONST->{'INDEX_PROJECT'} ];
            }

            if ( $metadata->version ) {
                $json->{'version'} = $metadata->version;
            }

            if ( $metadata->description ) {
                $json->{'description'} = $metadata->description;
            }

            if ( $metadata->author ) {
                $json->{'author'} = $metadata->author;
            }

            my $src = path('src');
            if ( !$src->mkdir ) {
                l( 'warning', "src directory could not be created: $src" );
            }

            if ( $src->is_dir ) {
                $json->{'main'} = 'src/index';
            }

            $path->spew_utf8( $j->utf8->pretty->encode($json) );

            return;
        }
    }->{$component}->();

    return;
}

main( $ARGV[0] );
