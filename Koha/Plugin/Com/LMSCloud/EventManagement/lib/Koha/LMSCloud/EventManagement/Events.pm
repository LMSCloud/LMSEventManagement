package Koha::LMSCloud::EventManagement::Events;

use Modern::Perl;

use Koha::LMSCloud::EventManagement::Event;

use base qw(Koha::Objects);

=head1 NAME

Koha::LMSCloud::EventManagement::Events - Koha LMSCloud EventManagement Events Object set class

=head1 API

=head2 Class Methods

=cut

=head3 filter

=cut

sub filter {
    my ( $self, $params ) = @_;

    my $search_params = {};
    $search_params->{name}              = { 'like' => "%$params->{name}%" }          if defined $params->{name} && $params->{name} ne q{};
    $search_params->{event_type}        = $params->{event_type}                      if ( defined $params->{event_type} && @{ $params->{event_type} } );
    $search_params->{min_age}           = { '>=' => $params->{min_age} }             if defined $params->{min_age};
    $search_params->{max_age}           = { '<=' => $params->{max_age} }             if defined $params->{max_age};
    $search_params->{open_registration} = $params->{open_registration}               if defined $params->{open_registration} && !$params->{open_registration};
    $search_params->{location}          = $params->{location}                        if ( defined $params->{location} && @{ $params->{location} } );
    $search_params->{start_time}        = { '>=' => $params->{start_time} }          if defined $params->{start_time};
    $search_params->{end_time}          = { '<=' => "$params->{end_time} 23:59:59" } if defined $params->{end_time} && $params->{end_time} ne q{};

    return $self->search($search_params);
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
