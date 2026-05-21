package Koha::Plugin::Com::LMSCloud::EventManagement::Util::Reporting::Scope;

use Modern::Perl;
use utf8;

use Carp qw( croak );
use Moose;
use Time::Piece ();
use Try::Tiny   qw( catch try );

our $VERSION = '1.0.0';

has 'start' => (
    is       => 'ro',
    isa      => 'Str',
    required => 1,
);

has 'end' => (
    is       => 'ro',
    isa      => 'Str',
    required => 1,
);

has 'branchcode' => (
    is      => 'ro',
    isa     => 'Maybe[Str]',
    default => undef,
);

sub BUILD {
    my ($self) = @_;

    for my $field (qw( start end )) {
        _validate_iso_date( $field, $self->$field );
    }

    croak 'Reporting::Scope: start (' . $self->start . ') must be on or before end (' . $self->end . ')'
        if $self->start gt $self->end;

    return;
}

sub _validate_iso_date {
    my ( $field, $value ) = @_;

    my $ok = try {
        Time::Piece->strptime( $value, '%Y-%m-%d' );
        return 1;
    }
    catch {
        return 0;
    };

    return if $ok;
    croak "Reporting::Scope: $field ('$value') is not a valid ISO YYYY-MM-DD date";
}

sub as_hashref {
    my ($self) = @_;
    return {
        start      => $self->start,
        end        => $self->end,
        branchcode => $self->branchcode,
    };
}

__PACKAGE__->meta->make_immutable;

1;
