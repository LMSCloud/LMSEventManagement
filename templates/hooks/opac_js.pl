
=pod

=head3 opac_js

This subroutine allows the plugin to inject custom JavaScript into the OPAC.

You can return a string of JavaScript wrapped in C<< <script> >> tags if necessary, or include external JavaScript files by constructing the appropriate HTML. This gives the plugin flexibility to include inline JavaScript or reference external JavaScript resources as needed.

=over 4

=item *

B<Parameters:>

=over 8

=item *

C<$self> - Koha::Plugin object (plugin instance)

=back

=item *

B<Returns:> String - a string containing JavaScript or HTML to be included in the OPAC.

=back

=cut

sub opac_js {
    my $self = shift;

    return <<~'JS';
    JS
}
