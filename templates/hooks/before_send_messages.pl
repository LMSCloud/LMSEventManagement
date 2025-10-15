
=pod

=head3 before_send_messages

This subroutine is a plugin hook that runs right before the message queue is processed
in the C<process_message_queue.pl> script.

Plugins implementing this hook can use it to modify or log messages before they are sent
to the recipients. The subroutine takes in parameters related to the messages being processed.

For example, the subroutine could log the parameters or manipulate them before allowing the message queue to proceed.

In this case, the subroutine does not perform any actions and returns an empty value by default.

=over 4

=item *

B<Parameters:>

=over 8

=item *

C<$self> - Koha::Plugin object (plugin instance)

=item *

C<$params> - HashRef containing the message queue parameters

=back

=item *

B<Returns:> Void

=back

=cut

sub before_send_messages {
    my ( $self, $params ) = @_;

    return;
}

