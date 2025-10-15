
=pod

=head3 opac_head

This subroutine allows the plugin to inject custom CSS into the OPAC.

You can return a string of CSS wrapped in C<< <style> >> tags if necessary, or include external CSS files by constructing the appropriate HTML. This flexibility allows plugins to style the OPAC interface, either with inline CSS or by linking to external resources.

=over 4

=item *

B<Parameters:>

=over 8

=item *

C<$self> - Koha::Plugin object (plugin instance)

=back

=item *

B<Returns:> String - a string containing CSS or HTML to be included in the OPAC head.

=back

=cut

sub opac_head {
    my $self = shift;

    return <<~'CSS';
    CSS
}
