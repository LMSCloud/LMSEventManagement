
=pod

=head3 intranet_catalog_biblio_enhancements_toolbar_button

This subroutine allows the plugin to add new HTML elements to the catalogue toolbar 
in the intranet interface. Typically, a button or similar interactive element is added.

Plugins can use this method to inject custom toolbar elements, which could be buttons, 
links, or other HTML components relevant to the plugin's functionality.

In this example, the subroutine returns a button with an icon and a JavaScript alert. 
The method returns a string of raw HTML that can be inserted into the toolbar.

=over 4

=item *

B<Parameters:>

=over 8

=item *

C<$self> - Koha::Plugin object (plugin instance)

=back

=item *

B<Returns:> String - a raw HTML string to be inserted into the toolbar.

=back

=cut

sub intranet_catalog_biblio_enhancements_toolbar_button {
    my $self = shift;

    return <<~'HTML';
    HTML
}
