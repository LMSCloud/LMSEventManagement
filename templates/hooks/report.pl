
=pod

=head3 report

The existence of a C<report> subroutine means the plugin is capable of running a report.

This subroutine handles generating reports, with the option to display the output in 
various formats (such as HTML or CSV). It allows for flexibility in how reports are generated 
and presented to the user, but it is recommended to modularize the code for anything beyond 
simple reports.

The subroutine may delegate to other methods for more complex report generation, 
such as C<report_step1> and C<report_step2>.

=over 4

=item *

B<Parameters:>

=over 8

=item *

C<$self> - Koha::Plugin object (plugin instance)

=item *

C<$args> - HashRef containing parameters related to the report

=back

=item *

B<Returns:> Void

=back

=cut

sub report {
    my ( $self, $args ) = @_;

    my $template = $self->get_template( { file => q{} } );

    return $self->output_html( $template->output );
}
