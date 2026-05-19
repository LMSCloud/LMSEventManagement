#!/usr/bin/env perl

use Modern::Perl;
use utf8;

use Getopt::Long;
use Term::ANSIColor qw( colored );

my $container = $ENV{CONTAINER_NAME} || 'lmscloud-koha-1';
my $binary    = $ENV{DOCKER_BINARY}  || 'docker';
my $count     = 200;
my $database  = 'kohadev';

GetOptions(
    'container=s' => \$container,
    'binary=s'    => \$binary,
    'count=i'     => \$count,
    'database=s'  => \$database,
);

my $table_prefix = 'koha_plugin_com_lmscloud_eventmanagement';
my $events_table = "${table_prefix}_events";
my $fees_table   = "${table_prefix}_e_tg_fees";
my $locations    = "${table_prefix}_locations";
my $types        = "${table_prefix}_event_types";
my $groups       = "${table_prefix}_target_groups";

my @types_pool = (
    [ 'Workshop',      'Workshop' ],
    [ 'Reading Group', 'Reading Group' ],
    [ 'Author Talk',   'Author Talk' ],
    [ 'Digital Skills', 'Digital Skills' ],
    [ 'Arts & Crafts', 'Arts & Crafts' ],
);

my @location_names = (
    'Main Library', 'Community Center',
    'Branch Library North', 'Online',
);

my @target_group_names = (
    'Children', 'Teens', 'Young Adults', 'Adults', 'Seniors',
    'Families', 'Toddlers', 'Preschool', 'Elementary School',
    'Middle School', 'High School', 'College Students',
    'Working Professionals', 'Retirees', 'New Parents',
    'ESL Learners', 'Veterans', 'Caregivers',
);

my @statuses = (
    ('confirmed') x 70,
    ('pending')   x 15,
    ('sold_out')  x 10,
    ('canceled')  x 5,
);

# Varying image dimensions to exercise the OPAC crop setting.
my @image_sizes = (
    [ 300,  200 ], [ 400,  250 ], [ 500,  300 ], [ 600,  400 ],
    [ 800,  450 ], [ 800,  600 ], [ 1000, 500 ], [ 1200, 500 ],
    [ 1200, 800 ], [ 1600, 900 ], [ 400,  600 ], [ 600,  900 ],
    [ 900,  900 ], [ 1024, 768 ],
);

my @title_themes = (
    'Watercolor', 'Robotics', 'Genealogy', 'Crochet', 'Poetry',
    'Mindfulness', 'Sourdough', 'Coding', 'Birdwatching',
    'Gardening', 'Calligraphy', 'Improv', 'Origami', 'Yoga',
    'Pottery', 'Linocut', 'Beekeeping', 'Astronomy', 'Soldering',
    'Knitting', 'Foraging', 'Esperanto', 'Cosplay', 'Banjo',
    'Drone Flight', 'Mosaic', 'Bookbinding', 'Hand Lettering',
    'Composting', 'Letterpress',
);

my @title_formats = (
    'Introduction to %s',
    '%s for Beginners',
    'Advanced %s Techniques',
    '%s Open House',
    'Hands-on %s Workshop',
    'Family %s Night',
    'After-school %s Lab',
    'Teen %s Circle',
    'Senior %s Meetup',
    '%s and Conversation',
);

my @lorem_sentences = (
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.',
    'Curabitur pretium tincidunt lacus, nulla gravida orci a odio.',
    'Nullam varius, turpis et commodo pharetra, est eros bibendum elit.',
    'Vivamus vestibulum sagittis sapien, eu fringilla justo ultrices ut.',
    'Mauris vulputate dolor sit amet nibh accumsan, sed pellentesque velit lacinia.',
    'Phasellus laoreet lorem vel dolor tempus vehicula, sed iaculis nisi rhoncus.',
    'Donec eget risus diam, et placerat nibh laoreet vitae.',
    'Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue.',
    'Aliquam erat volutpat. Nam dui mi, tincidunt quis accumsan porttitor.',
    'Suspendisse potenti. Cras dapibus, augue at eleifend tristique, nisi mauris convallis.',
    'Integer in sapien sit amet leo congue feugiat.',
);

sub q_sql {
    my ($s) = @_;
    $s //= '';
    $s =~ s/\\/\\\\/g;
    $s =~ s/'/''/g;
    return "'$s'";
}

sub pick { return $_[ int rand scalar @_ ] }

sub lorem_paragraphs {
    my ($paragraphs) = @_;
    my @out;
    for ( 1 .. $paragraphs ) {
        my $sentences = 3 + int rand 4;
        my @s = map { pick(@lorem_sentences) } 1 .. $sentences;
        push @out, '<p>' . join( ' ', @s ) . '</p>';
    }
    return join "\n", @out;
}

sub random_offset_days {
    return int( rand(210) ) - 30;
}

my $marker = '<!-- seed-many-events -->';

say colored( ['cyan'], "Seeding $count synthetic events into $container" );

# Build SQL in chunks so the heredoc into koha-mysql stays manageable.
my @rows;
for my $i ( 1 .. $count ) {
    my $theme  = pick(@title_themes);
    my $title  = sprintf pick(@title_formats), $theme;
    my $offset = random_offset_days();
    my $dur_h  = 1 + int rand 3;
    my $size   = $image_sizes[ int rand scalar @image_sizes ];

    # picsum supports /seed/{token}/{w}/{h}, which keeps the image stable
    # per event id (useful when iterating on layouts).
    my $image_url = sprintf 'https://picsum.photos/seed/lmsevt%d/%d/%d',
        $i, $size->[0], $size->[1];

    my $desc        = $marker . "\n" . lorem_paragraphs( 1 + int rand 3 );
    my $type_name   = $types_pool[ ( $i - 1 ) % scalar @types_pool ]->[0];
    my $loc_name    = $location_names[ ( $i - 1 ) % scalar @location_names ];
    my $status      = $statuses[ int rand scalar @statuses ];
    my $min_age     = ( 0, 5, 13, 16, 18, 25, 50, 65 )[ int rand 8 ];
    my $max_age     = $min_age + 5 + int rand 60;
    $max_age = 120 if $max_age > 120;
    my $participants = 10 + int rand 40;

    my $reg_end_offset = $offset - 1;
    my $row = sprintf <<"ROW",
SELECT %s,
       (SELECT id FROM $types WHERE name = %s LIMIT 1),
       %d, %d, %d,
       DATE_ADD(NOW(), INTERVAL %d DAY),
       DATE_ADD(DATE_ADD(NOW(), INTERVAL %d DAY), INTERVAL %d HOUR),
       NOW(),
       DATE_ADD(NOW(), INTERVAL %d DAY),
       (SELECT id FROM $locations WHERE name = %s LIMIT 1),
       %s, %s, %s, 1
ROW
        q_sql($title), q_sql($type_name),
        $min_age, $max_age, $participants,
        $offset, $offset, $dur_h, $reg_end_offset,
        q_sql($loc_name),
        q_sql($image_url), q_sql($desc), q_sql($status);
    chomp $row;
    push @rows, $row;
}

my $insert_sql = "INSERT INTO $events_table (\n"
    . "    name, event_type, min_age, max_age, max_participants,\n"
    . "    start_time, end_time, registration_start, registration_end,\n"
    . "    location, image, description, status, open_registration\n"
    . ")\n"
    . join( "\nUNION ALL\n", map { my $r = $_; $r =~ s/^SELECT/SELECT/; $r } @rows )
    . ";\n";

# Fan out target-group assignments. Each event needs at least one selected
# target group to be valid in the application's filter UI.
my $fees_sql = <<"FEES";
INSERT INTO $fees_table (event_id, target_group_id, selected, fee)
SELECT e.id, tg.id, 1, ROUND(RAND() * 15, 2)
FROM $events_table e
JOIN $groups tg
WHERE e.description LIKE '%$marker%'
  AND tg.name IN (
FEES

$fees_sql .= join( ',', map { q_sql($_) } @target_group_names ) . ")\n";
$fees_sql .= "  AND ((e.id + tg.id) % 5) = 0;\n";

my $sql = $insert_sql . $fees_sql;

say colored( ['cyan'], "Piping SQL into koha-mysql ($database) ..." );
open my $docker, '|-', $binary, 'exec', '-i', $container, 'koha-mysql', $database
    or die colored( ['red'], "Failed to spawn docker: $!" );
print $docker $sql;
close $docker;

if ( $? != 0 ) {
    die colored( ['red'], "✗ koha-mysql exited with status $?" );
}

say colored( ['green'], "✓ Seeded $count events with picsum images and lorem descriptions." );
say "    Filter marker in descriptions: $marker";
say "    Delete them later with: DELETE FROM $events_table WHERE description LIKE '%$marker%';";
