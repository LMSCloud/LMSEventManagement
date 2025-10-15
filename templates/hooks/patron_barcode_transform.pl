
=pod

=head3 patron_barcode_transform

This subroutine is a plugin hook that transforms input strings wherever patron barcodes are scanned.

The method operates on a reference to the barcode value, modifying the referenced value directly. There is no need to return a new value, as the transformation is applied in-place. This hook can be used to alter patron barcode formats or add prefixes/suffixes as needed.

=over 4

=item *

B<Parameters:>

=over 8

=item *

C<$self> - Koha::Plugin object (plugin instance)

=item *

C<$barcode_ref> - Reference to the barcode value being scanned

=back

=item *

B<Returns:> Void (modifies barcode in-place)

=back

=cut

sub patron_barcode_transform {
    my ( $self, $barcode_ref ) = @_;

    return;
}
