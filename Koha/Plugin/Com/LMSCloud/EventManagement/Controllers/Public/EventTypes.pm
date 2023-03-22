package Koha::Plugin::Com::LMSCloud::EventManagement::Controllers::Public::EventTypes;

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

my $EVENT_TYPES_TABLE                  = $self ? $self->get_qualified_table_name('event_types') : undef;
my $EVENT_TYPE_TARGET_GROUP_FEES_TABLE = $self ? $self->get_qualified_table_name('et_tg_fees')  : undef;

sub list {
    my $c = shift->openapi->valid_input or return;

    return try {
        my $sql = SQL::Abstract->new;
        my $dbh = C4::Context->dbh;

        my ( $stmt, @bind ) = $sql->select( $EVENT_TYPES_TABLE, q{*}, {} );
        my $sth = $dbh->prepare($stmt);
        $sth->execute(@bind);

        my $event_types = $sth->fetchall_arrayref( {} );

        foreach my $event_type ( @{$event_types} ) {
            ( $stmt, @bind ) = $sql->select( $EVENT_TYPE_TARGET_GROUP_FEES_TABLE, [ 'target_group_id', 'selected', 'fee' ], { event_type_id => $event_type->{id} } );
            $sth = $dbh->prepare($stmt);
            $sth->execute(@bind);

            my $target_groups = $sth->fetchall_arrayref( {} );
            $event_type->{'target_groups'} = $target_groups;
        }

        return $c->render( status => 200, openapi => $event_types || [] );
    }
    catch {
        return $c->unhandled_exception($_);
    };
}

1;
