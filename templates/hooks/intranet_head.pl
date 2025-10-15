
=pod

=head3 intranet_head

This subroutine allows the plugin to add custom CSS to the staff intranet interface.

You can return a string of CSS here, wrapped in C<< <style> >> tags if needed, or include external CSS files by constructing the appropriate HTML. This flexibility allows plugins to style the intranet interface in various ways, including injecting inline styles or linking to external resources.

=over 4

=item *

B<Parameters:>

=over 8

=item *

C<$self> - Koha::Plugin object (plugin instance)

=back

=item *

B<Returns:> String - a string containing HTML, CSS or JavaScript to be included in the intranet head.

=back

=cut

sub intranet_head {
    my $self = shift;

    return <<~'CSS';
    CSS
}
