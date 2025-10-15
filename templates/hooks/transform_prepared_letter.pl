=pod

=head3 transform_prepared_letter

This subroutine is a plugin hook used to modify prepared slips and notices.

It allows the plugin to alter the content of a prepared letter before it is sent. The method receives the prepared letter and can append or modify the content based on the plugin's requirements, such as adding custom messages or formatting adjustments.

=over 4

=item *

B<Parameters:>

=over 8

=item *

C<$self> - Koha::Plugin object (plugin instance)

=item *

C<$params> - HashRef containing the letter and related data

=back

=item *

B<Returns:> Void (modifies the letter in-place)

=back

=cut

sub transform_prepared_letter {
    my ( $self, $params ) = @_;

    return;
}
