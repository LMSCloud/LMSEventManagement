use utf8;

package Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEvent;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEvent

=cut

use strict;
use warnings;

use base 'DBIx::Class::Core';

=head1 TABLE: C<koha_plugin_com_lmscloud_eventmanagement_events>

=cut

__PACKAGE__->table("koha_plugin_com_lmscloud_eventmanagement_events");

=head1 ACCESSORS

=head2 id

  data_type: 'integer'
  is_auto_increment: 1
  is_nullable: 0

=head2 name

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 1
  size: 255

alphanumeric identifier, e.g. name of the event

=head2 event_type

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 1

the event type id from the event types table

=head2 min_age

  data_type: 'tinyint'
  extra: {unsigned => 1}
  is_nullable: 1

minimum age requirement

=head2 max_age

  data_type: 'tinyint'
  extra: {unsigned => 1}
  is_nullable: 1

maximum age requirement

=head2 max_participants

  data_type: 'smallint'
  extra: {unsigned => 1}
  is_nullable: 1

max number of participants

=head2 start_time

  data_type: 'datetime'
  datetime_undef_if_invalid: 1
  is_nullable: 1

start time of the event

=head2 end_time

  data_type: 'datetime'
  datetime_undef_if_invalid: 1
  is_nullable: 1

end time of the event

=head2 registration_start

  data_type: 'datetime'
  datetime_undef_if_invalid: 1
  is_nullable: 1

start time of the registration

=head2 registration_end

  data_type: 'datetime'
  datetime_undef_if_invalid: 1
  is_nullable: 1

end time of the registration

=head2 location

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 1

the location id from the locations table

=head2 image

  data_type: 'text'
  is_nullable: 1

image from kohas image management

=head2 description

  data_type: 'text'
  is_nullable: 1

description

=head2 status

  data_type: 'enum'
  default_value: 'pending'
  extra: {list => ["pending","confirmed","canceled","sold_out"]}
  is_nullable: 1

status of the event

=head2 registration_link

  data_type: 'text'
  is_nullable: 1

link to the registration form

=head2 open_registration

  data_type: 'tinyint'
  default_value: 0
  is_nullable: 1

is the registration to non-patrons via email

=cut

__PACKAGE__->add_columns(
    "id",
    { data_type => "integer", is_auto_increment => 1, is_nullable => 0 },
    "name",
    { data_type => "varchar", default_value => "", is_nullable => 1, size => 255 },
    "event_type",
    { data_type => "integer", is_foreign_key => 1, is_nullable => 1 },
    "min_age",
    { data_type => "tinyint", extra => { unsigned => 1 }, is_nullable => 1 },
    "max_age",
    { data_type => "tinyint", extra => { unsigned => 1 }, is_nullable => 1 },
    "max_participants",
    { data_type => "smallint", extra => { unsigned => 1 }, is_nullable => 1 },
    "start_time",
    {   data_type                 => "datetime",
        datetime_undef_if_invalid => 1,
        is_nullable               => 1,
    },
    "end_time",
    {   data_type                 => "datetime",
        datetime_undef_if_invalid => 1,
        is_nullable               => 1,
    },
    "registration_start",
    {   data_type                 => "datetime",
        datetime_undef_if_invalid => 1,
        is_nullable               => 1,
    },
    "registration_end",
    {   data_type                 => "datetime",
        datetime_undef_if_invalid => 1,
        is_nullable               => 1,
    },
    "location",
    { data_type => "integer", is_foreign_key => 1, is_nullable => 1 },
    "image",
    { data_type => "text", is_nullable => 1 },
    "description",
    { data_type => "text", is_nullable => 1 },
    "status",
    {   data_type     => "enum",
        default_value => "pending",
        extra         => { list => [ "pending", "confirmed", "canceled", "sold_out" ] },
        is_nullable   => 1,
    },
    "registration_link",
    { data_type => "text", is_nullable => 1 },
    "open_registration",
    { data_type => "tinyint", default_value => 0, is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</id>

=back

=cut

__PACKAGE__->set_primary_key("id");

=head1 RELATIONS

=head2 event_type

Type: belongs_to

Related object: L<Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEventType>

=cut

__PACKAGE__->belongs_to(
    "event_type",
    "Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEventType",
    { id => "event_type" },
    {   is_deferrable => 1,
        join_type     => "LEFT",
        on_delete     => "RESTRICT",
        on_update     => "RESTRICT",
    },
);

=head2 koha_plugin_com_lmscloud_eventmanagement_e_tg_fees

Type: has_many

Related object: L<Koha::Schema::Result::KohaPluginComLmscloudEventmanagementETgFee>

=cut

__PACKAGE__->has_many(
    "koha_plugin_com_lmscloud_eventmanagement_e_tg_fees",
    "Koha::Schema::Result::KohaPluginComLmscloudEventmanagementETgFee",
    { "foreign.event_id" => "self.id" },
    { cascade_copy       => 0, cascade_delete => 0 },
);

=head2 location

Type: belongs_to

Related object: L<Koha::Schema::Result::KohaPluginComLmscloudEventmanagementLocation>

=cut

__PACKAGE__->belongs_to(
    "location",
    "Koha::Schema::Result::KohaPluginComLmscloudEventmanagementLocation",
    { id => "location" },
    {   is_deferrable => 1,
        join_type     => "LEFT",
        on_delete     => "RESTRICT",
        on_update     => "RESTRICT",
    },
);

# Created by DBIx::Class::Schema::Loader v0.07049 @ 2023-04-11 13:28:05
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:JCVgleou31TrZ2yoFo7Msg

sub koha_object_class {
    'Koha::LMSCloud::EventManagement::Event';
}

sub koha_objects_class {
    'Koha::LMSCloud::EventManagement::Events';
}

# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
