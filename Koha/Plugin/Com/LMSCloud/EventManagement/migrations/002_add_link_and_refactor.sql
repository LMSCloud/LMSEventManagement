ALTER TABLE { { locations_table } }
ADD COLUMN `link` VARCHAR(2000) COMMENT 'link to the location, can be to a map or a website';
ALTER TABLE { { event_types_table } }
MODIFY `image` VARCHAR(2000) DEFAULT NULL COMMENT 'image from kohas image management';
ALTER TABLE { { events_table } }
MODIFY `image` VARCHAR(2000) DEFAULT NULL COMMENT 'image from kohas image management';
ALTER TABLE { { events_table } }
MODIFY `registration_link` VARCHAR(2000) COMMENT 'link to the registration form';
ALTER TABLE { { event_target_group_fees_table } }
MODIFY `fee` DECIMAL(15, 4) DEFAULT NULL COMMENT 'fee for the event';
ALTER TABLE { { event_type_target_group_fees_table } }
MODIFY `fee` DECIMAL(15, 4) DEFAULT NULL COMMENT 'fee for the event';