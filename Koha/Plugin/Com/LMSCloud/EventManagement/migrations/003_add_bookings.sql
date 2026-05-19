CREATE TABLE IF NOT EXISTS { { event_bookings_table } } (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `event_id` INT(11) NOT NULL COMMENT 'the event id from the events table',
    `booker_borrowernumber` INT(11) DEFAULT NULL COMMENT 'borrowernumber of the booking patron, NULL for anonymous bookings',
    `booker_name` VARCHAR(255) DEFAULT NULL COMMENT 'name supplied by anonymous booker',
    `booker_email` VARCHAR(255) DEFAULT NULL COMMENT 'email supplied by anonymous booker; also confirmation delivery target',
    `confirmation_token` VARCHAR(64) DEFAULT NULL COMMENT 'opaque token used to confirm the booking via email link; cleared once confirmed',
    `confirmed_at` DATETIME DEFAULT NULL COMMENT 'when the booking was confirmed (email link clicked or payment succeeded)',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_event` (`event_id`),
    KEY `idx_borrower` (`booker_borrowernumber`),
    KEY `idx_token` (`confirmation_token`),
    CONSTRAINT `chk_booker_identity` CHECK (
        `booker_borrowernumber` IS NOT NULL
        OR (`booker_name` IS NOT NULL AND `booker_email` IS NOT NULL)
    ),
    FOREIGN KEY (`event_id`) REFERENCES { { events_table } }(`id`) ON DELETE CASCADE
) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS { { event_attendees_table } } (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `booking_id` INT(11) NOT NULL COMMENT 'the booking id from the event_bookings table',
    `event_id` INT(11) NOT NULL COMMENT 'denormalised event id; must match parent booking',
    `attendee_borrowernumber` INT(11) DEFAULT NULL COMMENT 'borrowernumber of the attending patron, NULL for ad-hoc/anonymous attendees',
    `attendee_name` VARCHAR(255) NOT NULL COMMENT 'attendee display name; snapshotted at booking time even for patron attendees',
    `attendee_dob` DATE DEFAULT NULL COMMENT 'attendee date of birth; drives target-group eligibility suggestion',
    `target_group_id` INT(11) NOT NULL COMMENT 'target group selected for this attendee on this event',
    `fee_at_booking` DECIMAL(15, 4) NOT NULL COMMENT 'fee snapshot from event_target_group_fees at booking time; never updated',
    `status` ENUM('pending', 'confirmed', 'waitlisted', 'canceled', 'attended', 'no_show') NOT NULL DEFAULT 'pending' COMMENT 'attendee lifecycle state',
    `attended_at` DATETIME DEFAULT NULL,
    `canceled_at` DATETIME DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `active_borrower_key` VARCHAR(40) AS (
        CASE
            WHEN `status` IN ('canceled', 'no_show') OR `attendee_borrowernumber` IS NULL
                THEN NULL
            ELSE CONCAT(`event_id`, ':', `attendee_borrowernumber`)
        END
    ) STORED COMMENT 'generated key for partial unique: NULL excludes ad-hoc/canceled/no-show rows from the constraint',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_active_borrower` (`active_borrower_key`),
    KEY `idx_event_status` (`event_id`, `status`),
    KEY `idx_borrower_event` (`attendee_borrowernumber`, `event_id`),
    KEY `idx_booking` (`booking_id`),
    FOREIGN KEY (`booking_id`) REFERENCES { { event_bookings_table } }(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`event_id`) REFERENCES { { events_table } }(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`target_group_id`) REFERENCES { { target_groups_table } }(`id`)
) ENGINE = InnoDB;
