
=pod

=head3 uninstall

This subroutine is run just before the plugin files are deleted when a plugin is uninstalled.

It is good practice to clean up any data or database changes made by the plugin during its use. 
This might include removing custom database tables or other resources used by the plugin.

=over 4

=item *

B<Parameters:>

=over 8

=item *

C<$self> - Koha::Plugin object (plugin instance)

=item *

C<$args> - HashRef containing additional arguments for cleanup (optional)

=back

=item *

B<Returns:> Void

=back

=cut

sub uninstall {
    my ( $self, $args ) = @_;

    return;
}

