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
use Scalar::Util qw(looks_like_number reftype);
use Try::Tiny;

use Koha::UploadedFiles;

our $VERSION = '1.0.0';

=head1 Koha::Plugin::Com::LMSCloud::EventManagement::EventsController

A communication layer between the EventManagement module and the front end

=head2 Class methods

=head3 get

Handles retrieving events, optionally filtered by query parameters

=cut

sub get {
    my $c = shift->openapi->valid_input or return;

    my $params = {
        name              => $c->validation->param('name'),
        event_type        => ( $c->validation->param('event_type')   || $c->validation->every_param('event_types') ),
        branch            => ( $c->validation->param('branch')       || $c->validation->every_param('branches') ),
        target_group      => ( $c->validation->param('target_group') || $c->validation->every_param('target_groups') ),
        max_age           => $c->validation->param('max_age'),
        open_registration => $c->validation->param('open_registration'),
        fee               => $c->validation->param('fee'),
        location          => ( $c->validation->param('location') || $c->validation->every_param('locations') ),
        start_time        => $c->validation->param('start_time'),
        end_time          => $c->validation->param('end_time'),
    };

    return try {
        my $dbh   = C4::Context->dbh;
        my $query = 'SELECT * FROM koha_plugin_com_lmscloud_eventmanagement_events AS events' . _get_clause_conditions($params);

        my $sth    = $dbh->prepare($query);
        my $result = $sth->execute();

        my @events;
        while ( my $row = $sth->fetchrow_hashref() ) {
            if ( defined $row->{'image'} ) {
                my $image = Koha::UploadedFiles->find( $row->{'image'} );
                $row->{'image'} = $image->hashvalue . '_' . $image->filename();
            }

            push @events, $row;
        }

        if ( !( scalar @events ) ) {
            return $c->render(
                status  => 404,
                openapi => { error => 'Not Found' }
            );
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

    my @result;
    for my $key ( keys $params->%* ) {
        if ( defined $params->{$key} ) {
            push @result, _get_clause_condition( { key => $key, value => $params->{$key} } );
        }
    }

    if ( defined $params->{'start_time'} && defined $params->{'end_time'} ) {
        push @result, qq{ events.start_time BETWEEN '$params->{'start_time'}' AND '$params->{'end_time'}' };
    }

    return ( scalar grep {$_} @result ) ? q{ WHERE } . join 'AND', grep {$_} @result : q{};
}

sub _get_clause_condition {
    my ($args) = @_;

    if ( $args->{'key'} eq q{start_time} || $args->{'key'} eq q{end_time} ) {
        return q{};
    }

    if ( $args->{'key'} eq q{fee} || $args->{'key'} eq q{max_age} ) {
        return qq{ events.$args->{'key'} <= $args->{'value'} };
    }

    if ( reftype( $args->{'value'} ) eq 'ARRAY' ) {
        return scalar $args->{'value'} > 0
            ? join 'OR', map { qq{ events.$args->{'key'} = } . ( looks_like_number($_) ? qq{ $_ } : qq{ '$_' } ) } @{ $args->{'value'} }
            : q{};
    }

    return qq{ events.$args->{'key'} = } . ( looks_like_number( $args->{'value'} ) ? qq{ $args->{'value'} } : qq{ '$args->{'value'}' } );

}

1;
