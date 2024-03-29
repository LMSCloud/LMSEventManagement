use utf8;

package Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEtTgFee;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

Koha::Schema::Result::KohaPluginComLmscloudEventmanagementEtTgFees

=cut

use strict;
use warnings;

use base 'DBIx::Class::Core';

=head1 TABLE: C<koha_plugin_com_lmscloud_eventmanagement_et_tg_fees>

=cut

__PACKAGE__->table("koha_plugin_com_lmscloud_eventmanagement_et_tg_fees");

=head1 ACCESSORS

=head2 id

  data_type: 'integer'
  is_auto_increment: 1
  is_nullable: 0

=head2 event_type_id

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 1

the event type id from the event types table

=head2 target_group_id

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 1

the target group id from the target groups table

=head2 selected

  data_type: 'tinyint'
  default_value: 0
  is_nullable: 1

is the target group selected for the event

=head2 fee

  data_type: 'decimal'
  is_nullable: 1
  size: [15,4]

fee for the event

=cut

__PACKAGE__->add_columns(
    "id",              { data_type => "integer", is_auto_increment => 1, is_nullable => 0 },
    "event_type_id",   { data_type => "integer", is_foreign_key    => 1, is_nullable => 1 },
    "target_group_id", { data_type => "integer", is_foreign_key    => 1, is_nullable => 1 },
    "selected",        { data_type => "tinyint", default_value     => 0, is_nullable => 1 },
    "fee",             { data_type => "decimal", is_nullable       => 1, size        => [ 15, 4 ] },
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
    { id => "event_type_id" },
    {   is_deferrable => 1,
        join_type     => "LEFT",
        on_delete     => "RESTRICT",
        on_update     => "RESTRICT",
    },
);

=head2 target_group

Type: belongs_to

Related object: L<Koha::Schema::Result::KohaPluginComLmscloudEventmanagementTargetGroup>

=cut

__PACKAGE__->belongs_to(
    "target_group",
    "Koha::Schema::Result::KohaPluginComLmscloudEventmanagementTargetGroup",
    { id => "target_group_id" },
    {   is_deferrable => 1,
        join_type     => "LEFT",
        on_delete     => "RESTRICT",
        on_update     => "RESTRICT",
    },
);

# Created by DBIx::Class::Schema::Loader v0.07049 @ 2023-07-07 11:54:46
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:r1n/d9BB84eS2li/8MQjDA

sub koha_object_class {
    'Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fee';
}

sub koha_objects_class {
    'Koha::LMSCloud::EventManagement::EventType::TargetGroup::Fees';
}

# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
