package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Public::Events;

use 5.032;

use Modern::Perl;
use utf8;
use Mojo::Base 'Mojolicious::Controller';

use C4::Context;
use Try::Tiny;
use JSON;
use SQL::Abstract;
use Scalar::Util qw(looks_like_number reftype);

use Koha::UploadedFiles;

our $VERSION = '1.0.0';

my $self = undef;
if ( Koha::Plugin::Com::LMSCloud::EventManagement->can('new') ) {
    $self = Koha::Plugin::Com::LMSCloud::EventManagement->new;
}

my $EVENTS_TABLE = $self ? $self->get_qualified_table_name('events') : undef;

sub get {
    my $c = shift->openapi->valid_input or return;

    my $params = {
        name              => $c->validation->param('name'),
        event_type        => ( $c->validation->param('event_type')   || $c->validation->every_param('event_types') ),
        target_group      => ( $c->validation->param('target_group') || $c->validation->every_param('target_groups') ),
        min_age           => $c->validation->param('min_age'),
        max_age           => $c->validation->param('max_age'),
        open_registration => $c->validation->param('open_registration'),
        fee               => $c->validation->param('fee'),
        location          => ( $c->validation->param('location') || $c->validation->every_param('locations') ),
        start_time        => $c->validation->param('start_time'),
        end_time          => $c->validation->param('end_time'),
    };

    return try {
        my $sql = SQL::Abstract->new;
        my $dbh = C4::Context->dbh;

        # We check whether all params are undef with a grep
        # and return all events starting from the current date
        # if they are.
        my $has_no_params = grep {defined} values %{$params};
        if ($has_no_params) {
            my ( $stmt, @bind ) = $sql->select( $EVENTS_TABLE, q{*}, { start_time => { '>=' => 'CURDATE()' } } );
            my $sth = $dbh->prepare($stmt);
            $sth->execute(@bind);

            my $events = $sth->fetchall_arrayref( {} );

            return $c->render( status => 200, openapi => $events || [] );
        }

        my ( $stmt, @bind ) = $sql->select(
            $EVENTS_TABLE,
            q{*},
            {   name              => $params->{name},
                event_type        => { -in  => $params->{event_type} },
                target_group      => { -in  => $params->{target_group} },
                max_age           => { '>=' => $params->{min_age} },
                max_age           => { '<=' => $params->{max_age} },
                open_registration => $params->{open_registration},
                fee               => { '<=' => $params->{fee} },
                location          => { -in  => $params->{location} },
                start_time        => { '>=' => $params->{start_time} },
                end_time          => { '<=' => "$params->{end_time} 23:59:59" },
            }
        );

        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $events = $sth->fetchall_arrayref( {} );

        if ( !( scalar @{$events} ) ) {
            return $c->render(
                status  => 404,
                openapi => { error => 'Not Found' }
            );
        }

        return $c->render(
            status  => 200,
            openapi => $events,
        );
    }
    catch {
        $c->unhandled_exception($_);
    };
}

1;
