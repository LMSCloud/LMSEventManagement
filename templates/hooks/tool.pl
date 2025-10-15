
=pod

=head3 tool

The existence of a C<tool> subroutine means the plugin is capable of running a tool. 

The difference between a tool and a report is primarily semantic, but in general, 
any plugin that modifies the Koha database should be considered a tool rather than a report. 
Tools typically allow users to interact with and manipulate data, performing tasks such as scheduling jobs 
or modifying database entries.

The tool's logic can be modularized into different steps, depending on the complexity of the process.

=over 4

=item *

B<Parameters:>

=over 8

=item *

C<$self> - Koha::Plugin object (plugin instance)

=item *

C<$args> - HashRef containing the parameters for tool processing

=back

=item *

B<Returns:> Void

=back

=cut

sub tool {
    my ( $self, $args ) = @_;

    my $template = $self->get_template( { file => q{} } );

    return $self->output_html( $template->output );
}
