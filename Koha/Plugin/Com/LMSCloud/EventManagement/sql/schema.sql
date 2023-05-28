CREATE TABLE IF NOT EXISTS { { target_groups_table } } (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) DEFAULT '' COMMENT 'group from target_group table or any string',
    `min_age` TINYINT(3) unsigned DEFAULT '0' COMMENT 'lower age boundary of group',
    `max_age` TINYINT(3) unsigned DEFAULT '255' COMMENT 'upper age boundary for group',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS { { locations_table } } (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) DEFAULT '' COMMENT 'alphanumeric identifier, e.g. name of the place',
    `street` VARCHAR(255) DEFAULT '' COMMENT 'street address',
    `number` VARCHAR(255) DEFAULT '' COMMENT 'streetnumber',
    `city` VARCHAR(255) DEFAULT '' COMMENT 'city',
    `zip` VARCHAR(255) DEFAULT '' COMMENT 'zip code',
    `country` VARCHAR(255) DEFAULT 'GERMANY' COMMENT 'country',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS { { event_types_table } } (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) DEFAULT '' COMMENT 'alphanumeric identifier, e.g. name of the template',
    `min_age` TINYINT unsigned DEFAULT NULL COMMENT 'minimum age requirement',
    `max_age` TINYINT unsigned DEFAULT NULL COMMENT 'maximum age requirement',
    `max_participants` SMALLINT unsigned DEFAULT NULL COMMENT 'maximum allowed number of participants',
    `location` INT(11) DEFAULT NULL COMMENT 'id of a location from the locations table',
    `image` TEXT(65535) DEFAULT NULL COMMENT 'image from kohas image management',
    `description` TEXT COMMENT 'what is happening',
    `open_registration` TINYINT(1) DEFAULT '0' COMMENT 'is the registration to non-patrons via email',
    PRIMARY KEY (`id`)
) ENGINE = INNODB;
CREATE TABLE IF NOT EXISTS { { events_table } } (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) DEFAULT '' COMMENT 'alphanumeric identifier, e.g. name of the event',
    `event_type` INT(11) DEFAULT NULL COMMENT 'the event type id from the event types table',
    `min_age` TINYINT unsigned DEFAULT NULL COMMENT 'minimum age requirement',
    `max_age` TINYINT unsigned DEFAULT NULL COMMENT 'maximum age requirement',
    `max_participants` SMALLINT unsigned DEFAULT NULL COMMENT 'max number of participants',
    `start_time` DATETIME DEFAULT NULL COMMENT 'start time of the event',
    `end_time` DATETIME DEFAULT NULL COMMENT 'end time of the event',
    `registration_start` DATETIME DEFAULT NULL COMMENT 'start time of the registration',
    `registration_end` DATETIME DEFAULT NULL COMMENT 'end time of the registration',
    `location` INT(11) DEFAULT NULL COMMENT 'the location id from the locations table',
    `image` TEXT(65535) DEFAULT NULL COMMENT 'image from kohas image management',
    `description` TEXT(65535) DEFAULT NULL COMMENT 'description',
    `status` ENUM('pending', 'confirmed', 'canceled', 'sold_out') DEFAULT 'pending' COMMENT 'status of the event',
    `registration_link` TEXT(65535) COMMENT 'link to the registration form',
    `open_registration` TINYINT(1) DEFAULT '0' COMMENT 'is the registration to non-patrons via email',
    PRIMARY KEY (`id`),
    FOREIGN KEY (`event_type`) REFERENCES { { event_types_table } }(`id`),
    FOREIGN KEY (`location`) REFERENCES { { locations_table } }(`id`)
) ENGINE = INNODB;
CREATE TABLE IF NOT EXISTS { { event_target_group_fees_table } } (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `event_id` INT(11) DEFAULT NULL COMMENT 'the event id from the events table',
    `target_group_id` INT(11) DEFAULT NULL COMMENT 'the target group id from the target groups table',
    `selected` TINYINT(1) DEFAULT '0' COMMENT 'is the target group selected for the event',
    `fee` FLOAT unsigned DEFAULT NULL COMMENT 'fee for the event',
    PRIMARY KEY (`id`),
    FOREIGN KEY (`event_id`) REFERENCES { { events_table } }(`id`),
    FOREIGN KEY (`target_group_id`) REFERENCES { { target_groups_table } }(`id`)
) ENGINE = INNODB;
CREATE TABLE IF NOT EXISTS { { event_type_target_group_fees_table } } (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `event_type_id` INT(11) DEFAULT NULL COMMENT 'the event type id from the event types table',
    `target_group_id` INT(11) DEFAULT NULL COMMENT 'the target group id from the target groups table',
    `selected` TINYINT(1) DEFAULT '0' COMMENT 'is the target group selected for the event',
    `fee` FLOAT unsigned DEFAULT NULL COMMENT 'fee for the event',
    PRIMARY KEY (`id`),
    FOREIGN KEY (`event_type_id`) REFERENCES { { event_types_table } }(`id`),
    FOREIGN KEY (`target_group_id`) REFERENCES { { target_groups_table } }(`id`)
) ENGINE = INNODB;
INSERT INTO plugin_data (plugin_class, plugin_key, plugin_value)
VALUES (
        'Koha::Plugin::Com::LMSCloud::EventManagement',
        'opac_filters_age_enabled',
        false
    ),
    (
        'Koha::Plugin::Com::LMSCloud::EventManagement',
        'opac_filters_registration_and_dates_enabled',
        false
    ),
    (
        'Koha::Plugin::Com::LMSCloud::EventManagement',
        'opac_filters_fee_enabled',
        false
    );