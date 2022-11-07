package Koha::Plugin::Com::LMSCloud::EventManagement::EventsController;

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
# This program comes with ABSOLUTELY NO WARRANTY;

use Modern::Perl;
use utf8;
use 5.032;

use Mojo::Base 'Mojolicious::Controller';

use C4::Context;
use Scalar::Util qw(looks_like_number);
use Try::Tiny;

our $VERSION = '1.0.0';

=head1 Koha::Plugin::FancyPlugin::Controller

A class implementing the controller code handling fancy words

=head2 Class methods

=head3 get

Controller function that handles retrieving a single Koha::FancyWord object

=cut

sub get {
    my $c = shift->openapi->valid_input or return;

    my $params = {
        name              => $c->validation->param('name'),
        event_type        => $c->validation->param('event_type'),
        branch            => $c->validation->param('branch'),
        target_group      => $c->validation->param('target_group'),
        max_age           => $c->validation->param('max_age'),
        open_registration => $c->validation->param('open_registration'),
        fee               => $c->validation->param('fee'),
        location          => $c->validation->param('location'),
        start_time        => $c->validation->param('start_time'),
        end_time          => $c->validation->param('end_time'),
    };

    return try {
        my $dbh   = C4::Context->dbh;
        my $query = 'SELECT * FROM koha_plugin_com_lmscloud_eventmanagement_events AS events' . _get_clause_conditions($params);

        my $sth    = $dbh->prepare($query);
        my $result = $sth->execute();

        if ( !$result ) {
            return $c->render(
                status  => 404,
                openapi => { error => 'Not found' }
            );
        }

        my @events;
        while ( my $row = $sth->fetchrow_hashref() ) {
            push @events, $row;
        }

        return $c->render(
            status  => 200,        # https://wiki.koha-community.org/wiki/Coding_Guidelines_-_API#SWAGGER3.2.2_GET
            openapi => \@events,
        );
    }
    catch {
        $c->unhandled_exception($_);
    };
}

sub _get_clause_conditions {
    my ($params) = @_;

    # Filter for submitted params (ugly af imo)
    my $submitted_params = {};
    for my $key ( keys $params->%* ) {
        if ( defined $params->{$key} ) {
            $submitted_params->{$key} = $params->{$key};
        }
    }

    my $submitted_params_quantity = scalar keys %{$submitted_params};
    my $loop_counter              = 0;

    my $result;
    for my $key ( keys $params->%* ) {
        my $value = $submitted_params->{$key};

        if ( !( defined $value ) ) { next; }

        $result .= qq{ events.$key = } . ( looks_like_number($value) ? qq{ $value } : qq{ '$value' } );

        $loop_counter += 1;

        if ( !( $loop_counter == $submitted_params_quantity ) ) { $result .= q{AND} }

    }

    return $result ? qq{ WHERE $result } : q{};
}

1;
