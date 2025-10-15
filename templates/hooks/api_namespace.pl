
=pod

=head2 api_namespace

This subroutine defines the API namespace for the plugin. It returns the value
C<[a]>, which represents the subdomain in a structured domain format such as
C<[c].[b].[a]>.

In this context, the API namespace is typically used as part of a domain structure,
where C<[a]> is the subdomain, e.g., C<tld.org.project> for C<[a]> = C<project>, 
C<[b]> = C<org>, and C<[c]> = C<tld>.

=over 4

=item *

B<Parameters:> 

=over 8

=item *

C<$self> - Koha::Plugin object (plugin instance)

=back

=item *

B<Returns:> String representing the subdomain (C<[a]>).

=back

=cut

sub api_namespace {
    my $self = shift;

    # [a] here represents the <project> part of your name, but you can use
    # whatever you want here as long as it doesn't clash with other plugins.
    return '[a]';
}

