use utf8;

package Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEAttendee;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEAttendee

=cut

use strict;
use warnings;

use base 'DBIx::Class::Core';

=head1 TABLE: C<koha_plugin_com_lmscloud_eventmanagement_e_attendees>

=cut

__PACKAGE__->table("koha_plugin_com_lmscloud_eventmanagement_e_attendees");

=head1 ACCESSORS

=head2 id

  data_type: 'integer'
  is_auto_increment: 1
  is_nullable: 0

=head2 booking_id

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 0

the booking id from the event_bookings table

=head2 event_id

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 0

denormalised event id; must match parent booking

=head2 attendee_borrowernumber

  data_type: 'integer'
  is_nullable: 1

borrowernumber of the attending patron, NULL for ad-hoc/anonymous attendees

=head2 attendee_name

  data_type: 'varchar'
  is_nullable: 0
  size: 255

attendee display name; snapshotted at booking time even for patron attendees

=head2 attendee_dob

  data_type: 'date'
  datetime_undef_if_invalid: 1
  is_nullable: 1

attendee date of birth; drives target-group eligibility suggestion

=head2 target_group_id

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 0

target group selected for this attendee on this event

=head2 fee_at_booking

  data_type: 'decimal'
  is_nullable: 0
  size: [15,4]

fee snapshot from event_target_group_fees at booking time; never updated

=head2 status

  data_type: 'enum'
  default_value: 'pending'
  extra: {list => ["pending","confirmed","waitlisted","canceled","attended","no_show"]}
  is_nullable: 0

attendee lifecycle state

=head2 attended_at

  data_type: 'datetime'
  datetime_undef_if_invalid: 1
  is_nullable: 1

=head2 canceled_at

  data_type: 'datetime'
  datetime_undef_if_invalid: 1
  is_nullable: 1

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

=head2 active_borrower_key

  data_type: 'varchar'
  is_nullable: 1
  size: 40

generated key for partial unique: NULL excludes ad-hoc/canceled/no-show rows from the constraint

=cut

__PACKAGE__->add_columns(
    "id",
    { data_type => "integer", is_auto_increment => 1, is_nullable => 0 },
    "booking_id",
    { data_type => "integer", is_foreign_key => 1, is_nullable => 0 },
    "event_id",
    { data_type => "integer", is_foreign_key => 1, is_nullable => 0 },
    "attendee_borrowernumber",
    { data_type => "integer", is_nullable => 1 },
    "attendee_name",
    { data_type => "varchar", is_nullable => 0, size => 255 },
    "attendee_dob",
    { data_type => "date", datetime_undef_if_invalid => 1, is_nullable => 1 },
    "target_group_id",
    { data_type => "integer", is_foreign_key => 1, is_nullable => 0 },
    "fee_at_booking",
    { data_type => "decimal", is_nullable => 0, size => [ 15, 4 ] },
    "status",
    {   data_type     => "enum",
        default_value => "pending",
        extra         => { list => [ "pending", "confirmed", "waitlisted", "canceled", "attended", "no_show", ], },
        is_nullable   => 0,
    },
    "attended_at",
    {   data_type                 => "datetime",
        datetime_undef_if_invalid => 1,
        is_nullable               => 1,
    },
    "canceled_at",
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
    "active_borrower_key",
    { data_type => "varchar", is_nullable => 1, size => 40 },
);

=head1 PRIMARY KEY

=over 4

=item * L</id>

=back

=cut

__PACKAGE__->set_primary_key("id");

=head1 UNIQUE CONSTRAINTS

=head2 C<uniq_active_borrower>

=over 4

=item * L</active_borrower_key>

=back

=cut

__PACKAGE__->add_unique_constraint( "uniq_active_borrower", ["active_borrower_key"] );

=head1 RELATIONS

=head2 booking

Type: belongs_to

Related object: L<Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEBooking>

=cut

__PACKAGE__->belongs_to(
    "booking", "Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEBooking",
    { id => "booking_id" }, { is_deferrable => 1, on_delete => "CASCADE", on_update => "RESTRICT" },
);

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

=head2 target_group

Type: belongs_to

Related object: L<Koha::Schema::Result::KohaPluginComLmscloudEventmanagementTargetGroup>

=cut

__PACKAGE__->belongs_to(
    "target_group", "Koha::Schema::Result::KohaPluginComLmscloudEventmanagementTargetGroup",
    { id => "target_group_id" }, { is_deferrable => 1, on_delete => "RESTRICT", on_update => "RESTRICT" },
);

# Created by DBIx::Class::Schema::Loader v0.07049 @ 2026-05-19 16:49:15
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:SbzRYsz+FA/z7oC1/uRjTA

sub koha_object_class {
    'Koha::LMSCloud::EventManagement::Attendee';
}

sub koha_objects_class {
    'Koha::LMSCloud::EventManagement::Attendees';
}

1;
