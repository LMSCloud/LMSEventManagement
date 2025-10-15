=pod

=head3 cronjob_nightly

This subroutine is a plugin hook that is triggered by a nightly cron job.

Plugins can implement this method to perform routine tasks such as data cleanup, 
synchronization, or other maintenance work that needs to be executed on a scheduled basis.

The actual logic can vary depending on the plugin’s requirements, and this hook 
offers flexibility for handling nightly background operations.

=over 4

=item *

B<Parameters:>

=over 8

=item *

C<$self> - Koha::Plugin object (plugin instance)

=back

=item *

B<Returns:> Void

=back

=cut

sub cronjob_nightly {
    my $self = shift;

    return;
}
