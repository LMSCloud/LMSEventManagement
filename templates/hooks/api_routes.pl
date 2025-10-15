
=pod

=head2 api_routes

This subroutine returns valid OpenAPI 2.0 paths serialized as a hash reference.

If your plugin implements API routes, the `api_routes` method should be implemented
to provide OpenAPI-compliant routes. It is a good practice to write the OpenAPI 2.0 path
specifications in JSON and store them in the plugin, then read the spec within this method.
This allows for the reuse of the OpenAPI spec in mainline Koha, making this a good
prototyping tool for developing API routes.

This subroutine depends on the C<JSON> module for decoding the JSON specification.

=over 4

=item *

B<Parameters:>

=over 8

=item *

C<$self> - Koha::Plugin object (plugin instance)

=item *

C<$args> - HashRef containing additional arguments for route processing (optional)

=back

=item *

B<Returns:> HashRef containing the deserialized OpenAPI 2.0 paths.

=back

=cut

sub api_routes {
    my ( $self, $args ) = @_;

    my $spec_str = $self->mbf_read('openapi.json');
    my $spec     = decode_json($spec_str);

    return $spec;
}
