use utf8;

package Koha::Schema::Result::KohaPluginComLmscloudEventmanagementTargetGroup;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

Koha::Schema::Result::KohaPluginComLmscloudEventmanagementTargetGroup

=cut

use strict;
use warnings;

use base 'DBIx::Class::Core';

=head1 TABLE: C<koha_plugin_com_lmscloud_eventmanagement_target_groups>

=cut

__PACKAGE__->table("koha_plugin_com_lmscloud_eventmanagement_target_groups");

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

group from target_group table or any string

=head2 min_age

  data_type: 'tinyint'
  default_value: 0
  extra: {unsigned => 1}
  is_nullable: 1

lower age boundary of group

=head2 max_age

  data_type: 'tinyint'
  default_value: 255
  extra: {unsigned => 1}
  is_nullable: 1

upper age boundary for group

=cut

__PACKAGE__->add_columns(
    "id",
    { data_type => "integer", is_auto_increment => 1, is_nullable => 0 },
    "name",
    { data_type => "varchar", default_value => "", is_nullable => 1, size => 255 },
    "min_age",
    {   data_type     => "tinyint",
        default_value => 0,
        extra         => { unsigned => 1 },
        is_nullable   => 1,
    },
    "max_age",
    {   data_type     => "tinyint",
        default_value => 255,
        extra         => { unsigned => 1 },
        is_nullable   => 1,
    },
);

=head1 PRIMARY KEY

=over 4

=item * L</id>

=back

=cut

__PACKAGE__->set_primary_key("id");

=head1 RELATIONS

=head2 koha_plugin_com_lmscloud_eventmanagement_e_tg_fees

Type: has_many

Related object: L<Koha::Schema::Result::KohaPluginComLmscloudEventmanagementETgFee>

=cut

__PACKAGE__->has_many(
    "koha_plugin_com_lmscloud_eventmanagement_e_tg_fees", "Koha::Schema::Result::KohaPluginComLmscloudEventmanagementETgFee",
    { "foreign.target_group_id" => "self.id" }, { cascade_copy => 0, cascade_delete => 0 },
);

=head2 koha_plugin_com_lmscloud_eventmanagements_et_tg_fees

Type: has_many

Related object: L<Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEtTgFees>

=cut

__PACKAGE__->has_many(
    "koha_plugin_com_lmscloud_eventmanagements_et_tg_fees", "Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEtTgFees",
    { "foreign.target_group_id" => "self.id" }, { cascade_copy => 0, cascade_delete => 0 },
);

# Created by DBIx::Class::Schema::Loader v0.07049 @ 2023-07-07 11:38:59
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:jCEkqBEREVrbhwTAPNgXXw

sub koha_object_class {
    'Koha::LMSCloud::EventManagement::TargetGroup';
}

sub koha_objects_class {
    'Koha::LMSCloud::EventManagement::TargetGroups';
}

# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
