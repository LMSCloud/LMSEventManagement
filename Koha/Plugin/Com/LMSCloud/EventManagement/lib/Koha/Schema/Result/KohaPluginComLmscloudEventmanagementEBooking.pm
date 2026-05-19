use utf8;

package Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEBooking;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEBooking

=cut

use strict;
use warnings;

use base 'DBIx::Class::Core';

=head1 TABLE: C<koha_plugin_com_lmscloud_eventmanagement_e_bookings>

=cut

__PACKAGE__->table("koha_plugin_com_lmscloud_eventmanagement_e_bookings");

=head1 ACCESSORS

=head2 id

  data_type: 'integer'
  is_auto_increment: 1
  is_nullable: 0

=head2 event_id

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 0

the event id from the events table

=head2 booker_borrowernumber

  data_type: 'integer'
  is_nullable: 1

borrowernumber of the booking patron, NULL for anonymous bookings

=head2 booker_name

  data_type: 'varchar'
  is_nullable: 1
  size: 255

name supplied by anonymous booker

=head2 booker_email

  data_type: 'varchar'
  is_nullable: 1
  size: 255

email supplied by anonymous booker; also confirmation delivery target

=head2 confirmation_token

  data_type: 'varchar'
  is_nullable: 1
  size: 64

opaque token used to confirm the booking via email link; cleared once confirmed

=head2 confirmed_at

  data_type: 'datetime'
  datetime_undef_if_invalid: 1
  is_nullable: 1

when the booking was confirmed (email link clicked or payment succeeded)

=head2 created_at

  data_type: 'datetime'
  datetime_undef_if_invalid: 1
  default_value: 'current_timestamp()'
  is_nullable: 0

=head2 updated_at

  data_type: 'datetime'
  datetime_undef_if_invalid: 1
  default_value: 'current_timestamp()'
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
    "id",
    { data_type => "integer", is_auto_increment => 1, is_nullable => 0 },
    "event_id",
    { data_type => "integer", is_foreign_key => 1, is_nullable => 0 },
    "booker_borrowernumber",
    { data_type => "integer", is_nullable => 1 },
    "booker_name",
    { data_type => "varchar", is_nullable => 1, size => 255 },
    "booker_email",
    { data_type => "varchar", is_nullable => 1, size => 255 },
    "confirmation_token",
    { data_type => "varchar", is_nullable => 1, size => 64 },
    "confirmed_at",
    {   data_type                 => "datetime",
        datetime_undef_if_invalid => 1,
        is_nullable               => 1,
    },
    "created_at",
    {   data_type                 => "datetime",
        datetime_undef_if_invalid => 1,
        default_value             => \"current_timestamp",
        is_nullable               => 0,
    },
    "updated_at",
    {   data_type                 => "datetime",
        datetime_undef_if_invalid => 1,
        default_value             => \"current_timestamp",
        is_nullable               => 0,
    },
);

=head1 PRIMARY KEY

=over 4

=item * L</id>

=back

=cut

__PACKAGE__->set_primary_key("id");

=head1 RELATIONS

=head2 event

Type: belongs_to

Related object: L<Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEvent>

=cut

__PACKAGE__->belongs_to(
    "event",
    "Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEvent",
    { id            => "event_id" },
    { is_deferrable => 1, on_delete => "CASCADE", on_update => "RESTRICT" },
);

=head2 koha_plugin_com_lmscloud_eventmanagement_e_attendees

Type: has_many

Related object: L<Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEAttendee>

=cut

__PACKAGE__->has_many(
    "koha_plugin_com_lmscloud_eventmanagement_e_attendees",
    "Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEAttendee",
    { "foreign.booking_id" => "self.id" },
    { cascade_copy         => 0, cascade_delete => 0 },
);

# Created by DBIx::Class::Schema::Loader v0.07049 @ 2026-05-19 16:49:15
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:rHV45oVY4UOFn/8o+rHpbA

sub koha_object_class {
    'Koha::LMSCloud::EventManagement::Booking';
}

sub koha_objects_class {
    'Koha::LMSCloud::EventManagement::Bookings';
}

1;
