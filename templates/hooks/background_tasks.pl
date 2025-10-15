
=pod

=head3 background_tasks

This subroutine is a plugin hook used to register new background job types.

Plugins that implement this method should return a hash reference that maps job names
to the corresponding class that will handle the background job. Each entry in the hash
should consist of a key (job type name) and a value (fully qualified class name).

For example, if the plugin were registering a "greeter" job type, it would return
a hash like the following:

    {
        greeter => 'Koha::Plugin::Com::ByWaterSolutions::KitchenSink::Greeter'
    }

In this case, the method returns an empty hash reference, meaning no background jobs are registered by default.

=over 4

=item *

B<Returns:> HashRef that maps job names to their handling classes.

=back

=cut

sub background_tasks {
    return {};
}
