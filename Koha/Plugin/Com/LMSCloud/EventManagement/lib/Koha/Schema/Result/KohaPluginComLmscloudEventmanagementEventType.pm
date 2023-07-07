use utf8;
package Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEventType;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEventType

=cut

use strict;
use warnings;

use base 'DBIx::Class::Core';

=head1 TABLE: C<koha_plugin_com_lmscloud_eventmanagement_event_types>

=cut

__PACKAGE__->table("koha_plugin_com_lmscloud_eventmanagement_event_types");

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

alphanumeric identifier, e.g. name of the template

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

maximum allowed number of participants

=head2 location

  data_type: 'integer'
  is_nullable: 1

id of a location from the locations table

=head2 image

  data_type: 'varchar'
  is_nullable: 1
  size: 2000

image from kohas image management

=head2 description

  data_type: 'text'
  is_nullable: 1

what is happening

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
  "min_age",
  { data_type => "tinyint", extra => { unsigned => 1 }, is_nullable => 1 },
  "max_age",
  { data_type => "tinyint", extra => { unsigned => 1 }, is_nullable => 1 },
  "max_participants",
  { data_type => "smallint", extra => { unsigned => 1 }, is_nullable => 1 },
  "location",
  { data_type => "integer", is_nullable => 1 },
  "image",
  { data_type => "varchar", is_nullable => 1, size => 2000 },
  "description",
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

=head2 koha_plugin_com_lmscloud_eventmanagement_events

Type: has_many

Related object: L<Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEvent>

=cut

__PACKAGE__->has_many(
  "koha_plugin_com_lmscloud_eventmanagement_events",
  "Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEvent",
  { "foreign.event_type" => "self.id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 koha_plugin_com_lmscloud_eventmanagements_et_tg_fees

Type: has_many

Related object: L<Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEtTgFees>

=cut

__PACKAGE__->has_many(
  "koha_plugin_com_lmscloud_eventmanagements_et_tg_fees",
  "Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEtTgFees",
  { "foreign.event_type_id" => "self.id" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07049 @ 2023-07-07 11:54:46
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:XW5qmYO/y2WaklCUXwrhqw

sub koha_object_class {
    'Koha::LMSCloud::EventManagement::EventType';
}

sub koha_objects_class {
    'Koha::LMSCloud::EventManagement::EventTypes';
}

# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;