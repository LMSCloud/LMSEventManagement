package Koha::Plugin::Com::LMSCloud::EventManagement::Util::Reporting::Dashboard;

use Modern::Perl;
use utf8;

use Carp qw( croak );
use Moose;
use Scalar::Util ();

our $VERSION = '1.0.0';

has 'metrics' => (
    is       => 'ro',
    isa      => 'ArrayRef',
    required => 1,
);

has 'scope' => (
    is       => 'ro',
    isa      => 'Koha::Plugin::Com::LMSCloud::EventManagement::Util::Reporting::Scope',
    required => 1,
);

sub BUILD {
    my ($self) = @_;

    croak 'Reporting::Dashboard: metrics list is empty'
        if !@{ $self->metrics };

    my %seen;
    for my $metric ( @{ $self->metrics } ) {
        croak 'Reporting::Dashboard: every metric must be a Reporting::Metric instance'
            if !Scalar::Util::blessed($metric)
            || !$metric->isa('Koha::Plugin::Com::LMSCloud::EventManagement::Util::Reporting::Metric');

        my $id = $metric->id;
        croak "Reporting::Dashboard: duplicate metric id '$id'" if $seen{$id}++;
    }

    return;
}

sub serialize {
    my ($self) = @_;

    return {
        scope   => $self->scope->as_hashref,
        metrics => [ map { $_->compute } @{ $self->metrics } ],
    };
}

__PACKAGE__->meta->make_immutable;

1;
