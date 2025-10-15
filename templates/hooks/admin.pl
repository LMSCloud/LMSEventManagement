
=pod

=head2 admin

The existence of an 'admin' subroutine means the plugin has some functionality that
should only be available to Koha librarians with administrative privileges.

Such plugins will be displayed on the admin page and work in a similar way to the 'tool'
system.

=over 4

=item *

B<Parameters:>

=over 8

=item *

C<$self> - Koha::Plugin object (plugin instance)

=item *

C<$args> - HashRef containing arguments for the admin functionality

=back

=item *

B<Returns:> Void

=back

=cut

sub admin {
    my ( $self, $args ) = @_;

    my $template = $self->get_template( { file => q{} } );

    return $self->output_html( $template->output );
}
