
=pod

=head3 static_routes

This subroutine returns static API routes from a predefined JSON specification file.

It reads the JSON file, parses it, and returns the resulting data structure as a hash reference. 
This method is typically used to provide static API routes that do not change dynamically and 
are predefined in the plugin.

This subroutine depends on the C<JSON> module for decoding the JSON specification.

=over 4

=item *

B<Parameters:>

=over 8

=item *

C<$self> - Koha::Plugin object (plugin instance)

=item *

C<$args> - HashRef containing parameters related to route handling

=back

=item *

B<Returns:> HashRef - The parsed JSON structure representing static API routes.

=back

=cut

sub static_routes {
    my ( $self, $args ) = @_;

    my $spec_str = $self->mbf_read('staticapi.json');
    my $spec     = decode_json($spec_str);

    return $spec;
}

