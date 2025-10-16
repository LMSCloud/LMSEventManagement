-- Testing fixtures for LMSEventManagement plugin
-- This file contains sample data for development and testing purposes
-- DO NOT include this in production builds

-- Sample Target Groups
INSERT INTO __TARGET_GROUPS_TABLE__ (name, min_age, max_age) VALUES
('Children', 5, 12),
('Teens', 13, 17),
('Adults', 18, 64),
('Seniors', 65, 120),
('Families', 0, 120);

-- Sample Locations
INSERT INTO __LOCATIONS_TABLE__ (name, street, number, zip, city, country, link) VALUES
('Main Library', 'Library Street', '123', '12345', 'Example City', 'Example Country', 'https://maps.example.com/main-library'),
('Community Center', 'Center Avenue', '456', '12346', 'Example City', 'Example Country', 'https://maps.example.com/community-center'),
('Branch Library North', 'North Road', '789', '12347', 'Example City', 'Example Country', NULL),
('Online', '', '', '', '', '', 'https://meet.example.com');

-- Sample Event Types
INSERT INTO __EVENT_TYPES_TABLE__ (name, description, min_age, max_age, max_participants, location, open_registration) VALUES
('Workshop', 'Hands-on learning sessions with practical exercises', 13, 100, 20, 1, 0),
('Reading Group', 'Book discussion and literary analysis sessions', 13, 17, 15, 3, 0),
('Author Talk', 'Meet and greet with authors, book signings', 16, 100, 50, 2, 1),
('Digital Skills', 'Computer and technology training sessions', 65, 100, 12, 1, 0),
('Arts & Crafts', 'Creative activities and craft workshops', 5, 12, 25, 1, 0);

-- Sample Events
INSERT INTO __EVENTS_TABLE__ (
    name, event_type, min_age, max_age, max_participants,
    start_time, end_time, registration_start, registration_end,
    location, description, registration_link, open_registration
)
SELECT
    'Introduction to Digital Photography',
    (SELECT id FROM __EVENT_TYPES_TABLE__ WHERE name = 'Workshop' LIMIT 1),
    13, 100, 20,
    DATE_ADD(NOW(), INTERVAL 7 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 7 DAY), INTERVAL 2 HOUR),
    NOW(),
    DATE_ADD(NOW(), INTERVAL 6 DAY),
    (SELECT id FROM __LOCATIONS_TABLE__ WHERE name = 'Main Library' LIMIT 1),
    '<p>Learn the basics of digital photography including composition, lighting, and camera settings. Perfect for beginners!</p>',
    'https://example.com/register/photo-workshop',
    1
UNION ALL SELECT
    'Teen Book Club: Science Fiction',
    (SELECT id FROM __EVENT_TYPES_TABLE__ WHERE name = 'Reading Group' LIMIT 1),
    13, 17, 15,
    DATE_ADD(NOW(), INTERVAL 10 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 10 DAY), INTERVAL 90 MINUTE),
    NOW(),
    DATE_ADD(NOW(), INTERVAL 9 DAY),
    (SELECT id FROM __LOCATIONS_TABLE__ WHERE name = 'Branch Library North' LIMIT 1),
    '<p>Monthly book club for teens discussing popular science fiction titles. This month: The Martian by Andy Weir.</p>',
    '',
    1
UNION ALL SELECT
    'Children Story Time',
    (SELECT id FROM __EVENT_TYPES_TABLE__ WHERE name = 'Reading Group' LIMIT 1),
    5, 10, 30,
    DATE_ADD(NOW(), INTERVAL 3 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 3 DAY), INTERVAL 45 MINUTE),
    NOW(),
    DATE_ADD(NOW(), INTERVAL 2 DAY),
    (SELECT id FROM __LOCATIONS_TABLE__ WHERE name = 'Main Library' LIMIT 1),
    '<p>Weekly story time for young children featuring classic tales and interactive storytelling.</p>',
    '',
    1
UNION ALL SELECT
    'Meet the Author: Local Writers Showcase',
    (SELECT id FROM __EVENT_TYPES_TABLE__ WHERE name = 'Author Talk' LIMIT 1),
    16, 100, 50,
    DATE_ADD(NOW(), INTERVAL 14 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 14 DAY), INTERVAL 2 HOUR),
    NOW(),
    DATE_ADD(NOW(), INTERVAL 13 DAY),
    (SELECT id FROM __LOCATIONS_TABLE__ WHERE name = 'Community Center' LIMIT 1),
    '<p>Join us for an evening with local authors. Book signing and Q&A session included. Light refreshments will be served.</p>',
    'https://example.com/register/author-talk',
    1
UNION ALL SELECT
    'Seniors: Introduction to Tablets',
    (SELECT id FROM __EVENT_TYPES_TABLE__ WHERE name = 'Digital Skills' LIMIT 1),
    65, 100, 12,
    DATE_ADD(NOW(), INTERVAL 5 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 5 DAY), INTERVAL 90 MINUTE),
    NOW(),
    DATE_ADD(NOW(), INTERVAL 4 DAY),
    (SELECT id FROM __LOCATIONS_TABLE__ WHERE name = 'Main Library' LIMIT 1),
    '<p>Learn how to use a tablet computer. Topics include touchscreen basics, apps, and internet browsing. Tablets provided.</p>',
    '',
    1;

-- Link Events to Target Groups with Fees
-- Photography Workshop - Teens and Adults, with fees
INSERT INTO __EVENT_TARGET_GROUP_FEES_TABLE__ (event_id, target_group_id, selected, fee)
SELECT
    e.id,
    tg.id,
    1,
    CASE
        WHEN tg.name = 'Teens' THEN 5.00
        WHEN tg.name = 'Adults' THEN 10.00
        ELSE 0
    END
FROM __EVENTS_TABLE__ e, __TARGET_GROUPS_TABLE__ tg
WHERE e.name = 'Introduction to Digital Photography'
  AND tg.name IN ('Teens', 'Adults');

-- Teen Book Club - Teens only, free
INSERT INTO __EVENT_TARGET_GROUP_FEES_TABLE__ (event_id, target_group_id, selected, fee)
SELECT e.id, tg.id, 1, 0
FROM __EVENTS_TABLE__ e, __TARGET_GROUPS_TABLE__ tg
WHERE e.name = 'Teen Book Club: Science Fiction' AND tg.name = 'Teens';

-- Children Story Time - Children only, free
INSERT INTO __EVENT_TARGET_GROUP_FEES_TABLE__ (event_id, target_group_id, selected, fee)
SELECT e.id, tg.id, 1, 0
FROM __EVENTS_TABLE__ e, __TARGET_GROUPS_TABLE__ tg
WHERE e.name = 'Children Story Time' AND tg.name = 'Children';

-- Author Talk - Adults and Seniors, small fee
INSERT INTO __EVENT_TARGET_GROUP_FEES_TABLE__ (event_id, target_group_id, selected, fee)
SELECT
    e.id,
    tg.id,
    1,
    CASE
        WHEN tg.name = 'Adults' THEN 5.00
        WHEN tg.name = 'Seniors' THEN 3.00
        ELSE 0
    END
FROM __EVENTS_TABLE__ e, __TARGET_GROUPS_TABLE__ tg
WHERE e.name = 'Meet the Author: Local Writers Showcase'
  AND tg.name IN ('Adults', 'Seniors');

-- Tablet Training - Seniors only, free
INSERT INTO __EVENT_TARGET_GROUP_FEES_TABLE__ (event_id, target_group_id, selected, fee)
SELECT e.id, tg.id, 1, 0
FROM __EVENTS_TABLE__ e, __TARGET_GROUPS_TABLE__ tg
WHERE e.name = 'Seniors: Introduction to Tablets' AND tg.name = 'Seniors';
