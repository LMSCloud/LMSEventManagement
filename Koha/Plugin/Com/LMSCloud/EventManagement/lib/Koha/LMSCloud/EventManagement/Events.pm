package Koha::LMSCloud::EventManagement::Events;

use Modern::Perl;

use Koha::Database ();

use Koha::LMSCloud::EventManagement::Event ();

use base qw(Koha::Objects);

=head1 NAME

Koha::LMSCloud::EventManagement::Events - Koha LMSCloud EventManagement Events Object set class

=head1 API

=head2 Class Methods

=head3 filter

=cut

sub filter {
    my ( $self, $params ) = @_;

    my $search_params = {};

    if ( defined $params->{name} && $params->{name} ne q{} ) {
        $search_params->{name} = { 'like' => "%$params->{name}%" };
    }

    if ( defined $params->{event_type} && @{ $params->{event_type} } ) {
        $search_params->{event_type} = $params->{event_type};
    }

    if ( defined $params->{min_age} ) {
        $search_params->{min_age} = { '>=' => $params->{min_age} };
    }

    if ( defined $params->{max_age} ) {
        $search_params->{max_age} = { '<=' => $params->{max_age} };
    }

    if ( defined $params->{open_registration} && !$params->{open_registration} ) {
        $search_params->{open_registration} = $params->{open_registration};
    }

    if ( defined $params->{location} && @{ $params->{location} } ) {
        $search_params->{location} = $params->{location};
    }

    if ( defined $params->{start_time} ) {
        $search_params->{start_time} = { '>=' => $params->{start_time} };
    }

    if ( defined $params->{end_time} && $params->{end_time} ne q{} ) {
        $search_params->{end_time} = { '<=' => "$params->{end_time} 23:59:59" };
    }

    return $self->search($search_params);
}

=head3 compose_fees_search_params

=cut

sub compose_fees_search_params {
    my ( $self, $params, $is_public ) = @_;

    my $search_params = {};

    if ($is_public) {
        $search_params->{'me.selected'} = 1;
    }

    if ( defined $params->{'target_group'} && @{ $params->{'target_group'} } ) {
        $search_params->{'me.target_group_id'} = { '-in' => $params->{'target_group'} };
    }

    if ( defined $params->{'fee'} ) {
        $search_params->{'me.fee'} = { '<=' => $params->{'fee'} };
    }

    return $search_params;
}

=head3 are_upcoming

=cut

sub are_upcoming {
    my ($self) = @_;

    my $schema = Koha::Database->new->schema;
    my $dtf    = $schema->storage->datetime_parser;

    return $self->search( { end_time => { '>' => $dtf->format_datetime( DateTime->now( time_zone => 'UTC' ) ) } } );
}

=head2 Internal methods

=head3 _type

=cut

sub _type {
    return 'KohaPluginComLmscloudEventmanagementEvent';
}

=head3 object_class

=cut

sub object_class {
    return 'Koha::LMSCloud::EventManagement::Event';
}

1;
