use utf8;

package Koha::Schema::Result::KohaPluginComLmscloudEventmanagementLocation;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

Koha::Schema::Result::KohaPluginComLmscloudEventmanagementLocation

=cut

use strict;
use warnings;

use base 'DBIx::Class::Core';

=head1 TABLE: C<koha_plugin_com_lmscloud_eventmanagement_locations>

=cut

__PACKAGE__->table("koha_plugin_com_lmscloud_eventmanagement_locations");

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

alphanumeric identifier, e.g. name of the place

=head2 street

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 1
  size: 255

street address

=head2 number

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 1
  size: 255

streetnumber

=head2 city

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 1
  size: 255

city

=head2 zip

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 1
  size: 255

zip code

=head2 country

  data_type: 'varchar'
  default_value: 'GERMANY'
  is_nullable: 1
  size: 255

country

=head2 link

  data_type: 'varchar'
  is_nullable: 1
  size: 2000

link to the location, can be to a map or a website

=cut

__PACKAGE__->add_columns(
    "id",
    { data_type => "integer", is_auto_increment => 1, is_nullable => 0 },
    "name",
    { data_type => "varchar", default_value => "", is_nullable => 1, size => 255 },
    "street",
    { data_type => "varchar", default_value => "", is_nullable => 1, size => 255 },
    "number",
    { data_type => "varchar", default_value => "", is_nullable => 1, size => 255 },
    "city",
    { data_type => "varchar", default_value => "", is_nullable => 1, size => 255 },
    "zip",
    { data_type => "varchar", default_value => "", is_nullable => 1, size => 255 },
    "country",
    {   data_type     => "varchar",
        default_value => "GERMANY",
        is_nullable   => 1,
        size          => 255,
    },
    "link",
    { data_type => "varchar", is_nullable => 1, size => 2000 },
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
    { "foreign.location" => "self.id" },
    { cascade_copy       => 0, cascade_delete => 0 },
);

# Created by DBIx::Class::Schema::Loader v0.07049 @ 2023-07-07 12:20:39
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:kG/xNgI4Ty/ACJM/Oa9BcQ

sub koha_object_class {
    'Koha::LMSCloud::EventManagement::Location';
}

sub koha_objects_class {
    'Koha::LMSCloud::EventManagement::Locations';
}

# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
