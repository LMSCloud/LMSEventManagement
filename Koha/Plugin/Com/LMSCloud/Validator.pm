package Koha::Plugin::Com::LMSCloud::Validator;

use Moose;
use utf8;
use 5.010;

use DateTime::Format::Strptime ();
use Readonly                   ();

use Locale::Messages qw(
    bind_textdomain_filter
    bindtextdomain
    setlocale
    textdomain
);
use Locale::TextDomain ( 'com.lmscloud.eventmanagement', undef );
use POSIX qw( localtime );

our $VERSION = '1.0.0';

has 'schema' => (
    is       => 'ro',
    isa      => 'ArrayRef',
    required => 1,
);

has 'lang' => (
    is       => 'ro',
    isa      => 'Str',
    required => 0,
);

has '_parsers' => (
    is      => 'ro',
    isa     => 'ArrayRef',
    default => sub { [] },
);

Readonly::Scalar our $MAX_LENGTH_VARCHAR => 255;
Readonly::Scalar our $MAX_LENGTH_TEXT    => 65_535;
Readonly::Scalar our $MAX_LENGTH_INT     => 2_147_483_647;

sub BUILD {
    my ($self) = @_;
    my $plugin = Koha::Plugin::Com::LMSCloud::EventManagement->new;

    setlocale Locale::Messages::LC_MESSAGES(), q{};
    textdomain 'com.lmscloud.eventmanagement';
    bind_textdomain_filter 'com.lmscloud.eventmanagement', \&Encode::decode_utf8;
    bindtextdomain 'com.lmscloud.eventmanagement' => $plugin->bundle_path . '/locales/';

    $self->{'_parsers'} = [
        DateTime::Format::Strptime->new( pattern => '%Y-%m-%dT%H:%M:%S%z',    on_error => 'undef' ),    # format with timezone and seconds
        DateTime::Format::Strptime->new( pattern => '%Y-%m-%dT%H:%M:%S%Z',    on_error => 'undef' ),    # format with timezone and seconds
        DateTime::Format::Strptime->new( pattern => '%Y-%m-%dT%H:%M:%S',      on_error => 'undef' ),    # format with seconds but no timezone
        DateTime::Format::Strptime->new( pattern => '%Y-%m-%dT%H:%M:%S.%6N',  on_error => 'undef' ),    # format with microseconds and no timezone
        DateTime::Format::Strptime->new( pattern => '%Y-%m-%dT%H:%M:%SZ',     on_error => 'undef' ),    # format with 'Z' indicating UTC timezone and no seconds
        DateTime::Format::Strptime->new( pattern => '%Y-%m-%dT%H:%M:%S.%6NZ', on_error => 'undef' ),    # format with 'Z' indicating UTC timezone, microseconds and no seconds
        DateTime::Format::Strptime->new( pattern => '%Y-%m-%dT%H:%M%z',       on_error => 'undef' ),    # format with timezone and no seconds
        DateTime::Format::Strptime->new( pattern => '%Y-%m-%dT%H:%M%Z',       on_error => 'undef' ),    # format with 'Z' indicating UTC timezone and no seconds
        DateTime::Format::Strptime->new( pattern => '%Y-%m-%dT%H:%M',         on_error => 'undef' ),    # format with no timezone and no seconds
        DateTime::Format::Strptime->new( pattern => '%Y-%m-%d %H:%M:%S',      on_error => 'undef' ),    # format sql-friendly with no timezone
        DateTime::Format::Strptime->new( pattern => '%Y-%m-%d %H:%M',         on_error => 'undef' ),    # format sql-friendly with no timezone and no seconds
    ];

    return;
}

sub validate {
    my ($self) = shift;

    my $errors = [];
    for my $task ( @{ $self->schema } ) {
        my $method = "is_valid_$task->{'type'}";

        my ( $is_valid, $_errors ) = $self->$method(
            {   key   => $task->{'key'},
                value => $task->{'value'},
                %{ $task->{'options'} // {} }
            }
        );
        if ( !$is_valid ) {
            push @{$errors}, @{$_errors};
        }
    }
    return ( 0, $errors ) if @{$errors};

    return (1);
}

sub is_valid {
    my ( $self, $args ) = @_;

    # Return immediately if the given value is nullish and the nullable option is true.
    return ( 1, [] ) if !$args->{'value'} && $args->{'nullable'};

    # Return immediately if the given value is not defined.
    return ( 0, [ __('The given value is not defined.') ] ) if !defined $args->{'value'};

    return (1);
}

# possible options: nullable: boolean, length: int
sub is_valid_string {
    my ( $self, $args ) = @_;
    local $ENV{LANGUAGE}       = $self->lang || 'en';
    local $ENV{OUTPUT_CHARSET} = 'UTF-8';

    my ( $is_valid, $errors ) = $self->is_valid($args);
    if ( !$is_valid || ( $is_valid && defined $errors && ref($errors) eq 'ARRAY' && !@{$errors} ) ) {
        return ( $is_valid, $errors );
    }

    # Uses a regular expression to check whether the given value is alphanumeric.
    my $skip_is_alphanumeric = $args->{'is_alphanumeric'}->{'skip'} // 0;
    my $is_alphanumeric;

    if ($skip_is_alphanumeric) {
        $is_alphanumeric = 1;
    }
    else {
        my $alphanumeric_regex = '^[[:alnum:]';
        my $allow_chars        = $args->{'is_alphanumeric'}->{'allow_chars'} // [];
        if ($allow_chars) {
            foreach my $char ( $allow_chars->@* ) {
                $alphanumeric_regex .= quotemeta $char;
            }
        }
        $alphanumeric_regex .= ']+$';
        $is_alphanumeric = $args->{'value'} =~ m/$alphanumeric_regex/smx;
    }

    # Uses a regular expression to check whether the given value has a certain length using the supplied length.
    my $has_given_length = defined $args->{'length'} ? $args->{'value'} =~ m/^.{1,$args->{'length'}}$/smx : 1;

    # Checks whether the given value exceeds the $MAX_LENGTH_VARCHAR, $MAX_LENGTH_TEXT or a user specified length.
    my $exceeds_max_length = 0;
    if ( $args->{'exceeds_max_length'}->{'TEXT'} ) {
        $exceeds_max_length = length $args->{'value'} >= $MAX_LENGTH_TEXT;
    }
    elsif ( $args->{'exceeds_max_length'}->{'length'} ) {
        $exceeds_max_length = length $args->{'value'} >= $args->{'exceeds_max_length'}->{'length'};
    }
    else {
        $exceeds_max_length = length $args->{'value'} >= $MAX_LENGTH_VARCHAR;
    }

    if ( $is_alphanumeric && $has_given_length && !$exceeds_max_length ) {
        return (1);
    }

    $errors = [];
    my $given_argument = defined $args->{'key'} ? __('The given value for ') . $args->{'key'} : __('The given value: ') . $args->{'value'};
    if ( !$is_alphanumeric ) {
        push @{$errors}, $given_argument . __(' is not alphanumeric.');
    }

    if ( !$has_given_length ) {
        push @{$errors}, $given_argument . __(' has not the given length.');
    }

    if ($exceeds_max_length) {
        push @{$errors}, $given_argument . __(' exceeds the maximum length.');
    }

    return ( 0, $errors );
}

# possible options: nullable: boolean, positive: boolean, max_value: int, range: arrayref
sub is_valid_number {
    my ( $self, $args ) = @_;
    local $ENV{LANGUAGE}       = $self->lang || 'en';
    local $ENV{OUTPUT_CHARSET} = 'UTF-8';

    my ( $is_valid, $errors ) = $self->is_valid($args);
    if ( !$is_valid || ( $is_valid && defined $errors && ref($errors) eq 'ARRAY' && !@{$errors} ) ) {
        return ( $is_valid, $errors );
    }

    my ( $min, $max ) = defined $args->{'range'} ? @{ $args->{'range'} } : ( 0, $MAX_LENGTH_INT );

    # Uses a regular expression to check whether the given number is a number.
    my $is_number = $args->{'value'} =~ m/^\d+$/smx;

    # Uses a regular expression to check whether the given number has a certain length if the length option is defined.
    my $has_given_length = defined $args->{'length'} ? $args->{'value'} =~ m/^.{1,$args->{'length'}}$/smx : 1;

    # Uses a regular expression to check whether the given number is positive if the positive option is true.
    my $is_positive = $args->{'positive'} ? $args->{'value'} =~ m/^\d+$/smx : 1;

    # Checks whether the given value exceeds a certain value if the max_value option defined.
    my $exceeds_max_value = defined $args->{'max_value'} ? $args->{'value'} > $args->{'max_value'} : 0;

    # Checks whether the given value is in a certain range if the range option is defined or between 0 and $MAX_LENGTH_INT.
    my $is_in_range = defined $args->{'range'} ? ( $args->{'value'} >= $min && $args->{'value'} <= $max ) : ( $args->{'value'} >= 0 && $args->{'value'} <= $MAX_LENGTH_INT );

    # Check if all options specified in args are true.
    if (   $is_number
        && $has_given_length
        && $is_positive
        && !$exceeds_max_value
        && $is_in_range )
    {
        return (1);
    }

    $errors = [];
    my $given_argument = defined $args->{'key'} ? __('The given value for ') . $args->{'key'} : __('The given value: ') . $args->{'value'};
    if ( !$is_number ) {
        push @{$errors}, $given_argument . __(' is not a number.');
    }
    if ( !$has_given_length ) {
        push @{$errors}, $given_argument . __(' has not the given length.');
    }
    if ( !$is_positive ) {
        push @{$errors}, $given_argument . __(' is not positive.');
    }
    if ($exceeds_max_value) {
        push @{$errors}, $given_argument . __(' exceeds the maximum value.');
    }
    if ( !$is_in_range ) {
        push @{$errors}, $given_argument . __(' is not in the given range.');
    }

    return ( 0, $errors );
}

# possible options: nullable: boolean, after: boolean, before: boolean
sub is_valid_datetime {
    my ( $self, $args ) = @_;
    local $ENV{LANGUAGE}       = $self->lang || 'en';
    local $ENV{OUTPUT_CHARSET} = 'UTF-8';

    my ( $is_valid, $errors ) = $self->is_valid($args);
    if ( !$is_valid || ( $is_valid && defined $errors && ref($errors) eq 'ARRAY' && !@{$errors} ) ) {
        return ( $is_valid, $errors );
    }

    # Use the custom parsers to check whether the given value is a valid datetime
    my $dt;
    for my $parser ( @{ $self->_parsers } ) {
        $dt = eval { defined $args->{'value'} ? $parser->parse_datetime( $args->{'value'} ) : undef };
        last if defined $dt;
    }

    my $is_valid_datetime = defined $dt ? 1 : 0;

    # Check if the year is at least 1000 (4 digits) to prevent dates like "0226-01-01"
    my $has_valid_year = 1;
    if ( $is_valid_datetime && $dt ) {
        $has_valid_year = $dt->year >= 1000;
    }

    # Checks whether the given value is equal or greater than the current localtime if the after option is true.
    # This assumes that the server this is run on is in the same timezone as the client.
    my $is_after_localtime = defined $args->{'after'} ? ( $args->{'value'} ge localtime->strftime('%Y-%m-%dT%H:%M:%S%z') ) : 1;

    # Checks whether the given value is equal or less than a supplied datetime in the format YYYY-MM-DDTHH:mm(:ss)(Z|(+/-)hh:mm) if the before option is defined.
    my $is_before = defined $args->{'before'} ? ( $args->{'value'} le $args->{'before'} ) : 1;

    # Check if all options specified in args are true.
    if ( $is_valid_datetime && $has_valid_year && $is_after_localtime && $is_before ) {
        return (1);
    }

    $errors = [];
    my $given_argument = defined $args->{'key'} ? __('The given value for ') . $args->{'key'} : __('The given value: ') . $args->{'value'};
    if ( !$is_valid_datetime ) {
        push @{$errors}, $given_argument . __(' is not a valid datetime value.');
    }
    if ( !$has_valid_year ) {
        push @{$errors}, $given_argument . __(' has an invalid year (must be 4 digits, >= 1000).');
    }
    if ( !$is_after_localtime ) {
        push @{$errors}, $given_argument . __(' is not after the current localtime.');
    }
    if ( !$is_before ) {
        push @{$errors}, $given_argument . __(' is not before the given datetime.');
    }

    return ( 0, $errors );
}

# possible options: nullable: boolean
sub is_valid_color {
    my ( $self, $args ) = @_;
    local $ENV{LANGUAGE}       = $self->lang || 'en';
    local $ENV{OUTPUT_CHARSET} = 'UTF-8';

    my ( $is_valid, $errors ) = $self->is_valid($args);
    if ( !$is_valid || ( $is_valid && defined $errors && ref($errors) eq 'ARRAY' && !@{$errors} ) ) {
        return ( $is_valid, $errors );
    }

    # Uses a regular expression to check whether the given value is a color in the format
    # #RRGGBB or
    # rgb([0-9]{3}, [0-9]{3}, [0-9]{3}) or
    # rgba([0-9]{3}, [0-9]{3}, [0-9]{3}, (0(\.\d+)?|1(\.0+)?)).
    my $is_valid_color = $args->{'value'} =~ m/^#(?:[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\((\d{1,3},\s*){2}\d{1,3}\)$|^rgba\((\d{1,3},\s*){3}(0(\.\d+)?|1(\.0+)?)\)$/smx;

    # Check if all options specified in args are true.
    if ($is_valid_color) {
        return (1);
    }

    $errors = [];
    my $given_argument = defined $args->{'key'} ? __('The given value for ') . $args->{'key'} : __('The given value: ') . $args->{'value'};
    if ( !$is_valid_color ) {
        push @{$errors}, $given_argument . __(' is not a color in the format #RRGGBB or rgb(0-255, 0-255, 0-255) or rgba(0-255, 0-255, 0-255, 0.0-1.0).');
    }

    return ( 0, $errors );
}

sub is_valid_time {
    my ( $self, $args ) = @_;
    local $ENV{LANGUAGE}       = $self->lang || 'en';
    local $ENV{OUTPUT_CHARSET} = 'UTF-8';

    my ( $is_valid, $errors ) = $self->is_valid($args);
    if ( !$is_valid || ( $is_valid && defined $errors && ref($errors) eq 'ARRAY' && !@{$errors} ) ) {
        return ( $is_valid, $errors );
    }

    # Uses a regular expression to check whether the given value is a time in the format HH:mm.
    my $is_valid_time = $args->{'value'} =~ m/^\d{2}:\d{2}$/smx;

    # Check if all options specified in args are true.
    if ($is_valid_time) {
        return (1);
    }

    $errors = [];
    my $given_argument = defined $args->{'key'} ? __('The given value for ') . $args->{'key'} : __('The given value: ') . $args->{'value'};
    if ( !$is_valid_time ) {
        push @{$errors}, $given_argument . __(' is not a time in the format HH:mm.');
    }

    return ( 0, $errors );
}

=pod

=head1 NAME

Koha::Plugin::Com::LMSCloud::Validator - A module containing functions to validate input.

=head1 SYNOPSIS

use Koha::Plugin::Com::LMSCloud::Validator;

my $validator = Koha::Plugin::Com::LMSCloud::Validator->new(
    {   schema => [
            { key => 'maxcapacity',     value => $room->{'maxcapacity'},     type => 'number' },
            { key => 'color',           value => $room->{'color'},           type => 'color' },
            { key => 'maxbookabletime', value => $room->{'maxbookabletime'}, type => 'number' },
            {   key     => 'roomnumber',
                value   => $room->{'roomnumber'},
                type    => 'string',
                options => { length => 20 }
            },
        ]
    }
);
my ( $is_valid, $errors ) = $validator->validate();

=head1 AUTHOR

Paul Derscheid <paul.derscheid@lmscloud.de>

=cut

1;
