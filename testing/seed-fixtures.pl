#!/usr/bin/env perl

use Modern::Perl;
use utf8;
use 5.010;

use FindBin qw( $RealBin );
use File::Spec;
use Term::ANSIColor qw( colored );
use Getopt::Long;

# Get options
my $container = $ENV{CONTAINER_NAME} || 'lmscloud-koha-1';
my $binary    = $ENV{DOCKER_BINARY}  || 'docker';

GetOptions(
    'container=s' => \$container,
    'binary=s'    => \$binary,
);

say colored( ['cyan'], "Seeding test fixtures for LMSEventManagement" );
say "Container: $container";
say "";

# Load .env to get plugin name
my $env_file = File::Spec->catfile( $RealBin, '..', '.env' );
my $plugin_name = 'Koha::Plugin::Com::LMSCloud::EventManagement';

if ( -f $env_file ) {
    open my $fh, '<', $env_file or die "Cannot open $env_file: $!";
    while ( my $line = <$fh> ) {
        chomp $line;
        if ( $line =~ /^PLUGIN_NAME=(.+)$/ ) {
            $plugin_name = $1;
            last;
        }
    }
    close $fh;
}

# Convert plugin name to table prefix
# Koha::Plugin::Com::LMSCloud::EventManagement -> koha_plugin_com_lmscloud_eventmanagement
my $table_prefix = lc($plugin_name);
$table_prefix =~ s/::/_/g;

# Table names
my $target_groups_table = $table_prefix . '_target_groups';
my $locations_table     = $table_prefix . '_locations';
my $event_types_table   = $table_prefix . '_event_types';
my $events_table        = $table_prefix . '_events';
my $e_tg_fees_table     = $table_prefix . '_e_tg_fees';
my $et_tg_fees_table    = $table_prefix . '_et_tg_fees';

say colored( ['yellow'], "Using table names:" );
say "  - $target_groups_table";
say "  - $locations_table";
say "  - $event_types_table";
say "  - $events_table";
say "  - $e_tg_fees_table";
say "  - $et_tg_fees_table";
say "";

# Read seed file
my $seed_file = File::Spec->catfile( $RealBin, 'fixtures', 'seed.sql' );
die colored( ['red'], "Error: Seed file not found: $seed_file" ) unless -f $seed_file;

open my $fh, '<:utf8', $seed_file or die "Cannot open $seed_file: $!";
my $sql = do { local $/; <$fh> };
close $fh;

# Replace placeholders
$sql =~ s/__TARGET_GROUPS_TABLE__/$target_groups_table/g;
$sql =~ s/__LOCATIONS_TABLE__/$locations_table/g;
$sql =~ s/__EVENT_TYPES_TABLE__/$event_types_table/g;
$sql =~ s/__EVENTS_TABLE__/$events_table/g;
$sql =~ s/__EVENT_TARGET_GROUP_FEES_TABLE__/$e_tg_fees_table/g;
$sql =~ s/__EVENT_TYPE_TARGET_GROUP_FEES_TABLE__/$et_tg_fees_table/g;

# Execute SQL in container
say colored( ['cyan'], "Loading fixtures..." );

# Pipe SQL to docker exec
open my $docker, '|-', $binary, 'exec', '-i', $container, 'koha-mysql', 'kohadev'
    or die colored( ['red'], "Failed to execute docker command: $!" );

print $docker $sql;

close $docker;

if ( $? == 0 ) {
    say "";
    say colored( ['green'], "✓ Fixtures loaded successfully!" );
    say "";
    say "Sample data created:";
    say "  - 25 Target Groups (Children, Teens, Young Adults, Adults, Seniors, and more)";
    say "  - 4 Locations (Main Library, Community Center, Branch Library North, Online)";
    say "  - 5 Event Types (Workshop, Reading Group, Author Talk, Digital Skills, Arts & Crafts)";
    say "  - 5 Events with various dates, participants, and fees";
    say "  - Target group assignments for each event";
    say "";
    say colored( ['green'], "You can now test the event management system!" );
}
else {
    say colored( ['red'], "✗ Failed to load fixtures" );
    exit 1;
}
