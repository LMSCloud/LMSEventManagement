package Koha::Plugin::Com::LMSCloud::EventManagement::Validators;

use Modern::Perl;
use utf8;
use 5.032;

our $VERSION = '1.0.0';

our @EXPORT = qw(
    validate_event
    validate_event_type
);

sub validate_event {
    my ($event) = @_;

    return 1;
}

sub validate_event_type {
    my ($event_type) = @_;

    return 1;
}

1;
