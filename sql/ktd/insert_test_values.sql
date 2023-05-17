INSERT INTO koha_plugin_com_lmscloud_eventmanagement_target_groups (name, min_age, max_age) VALUES
('Children', 0, 12),
('Teenagers', 13, 19),
('Adults', 20, 64),
('Seniors', 65, 255);

INSERT INTO koha_plugin_com_lmscloud_eventmanagement_locations (name, street, number, city, zip, country) VALUES
('City Park', 'Main St', '1', 'New York', '10001', 'USA'),
('Central Library', 'Park Ave', '100', 'Los Angeles', '90071', 'USA'),
('Museum of Natural History', 'Central Park West', '79', 'New York', '10024', 'USA'),
('Community Center', 'Oak St', '500', 'Chicago', '60601', 'USA'),
('Concert Hall', 'Baker St', '221B', 'London', 'NW1 6XE', 'UK'),
('Art Gallery', 'Champs-Élysées', '9', 'Paris', '75008', 'France'),
('Science Museum', 'Exhibition Rd', '1', 'London', 'SW7 2DD', 'UK'),
('City Beach', 'Beach Rd', '1', 'Sydney', '2000', 'Australia'),
('Zoo', 'Riehentorstrasse', '31', 'Basel', '4058', 'Switzerland'),
('National Park', 'Yosemite Valley', '', 'Yosemite', '95389', 'USA');

INSERT INTO koha_plugin_com_lmscloud_eventmanagement_event_types (name, min_age, max_age, max_participants, location, description, open_registration) VALUES
('Movie Night', 0, 255, 100, 1, 'Enjoy a movie under the stars', 1),
('Art Workshop', 10, 255, 20, 6, 'Create your own masterpiece', 0),
('Nature Walk', 18, 255, 30, 10, 'Explore the beauty of the great outdoors', 1),
('Science Fair', 6, 18, 50, 7, 'Discover the wonders of science', 0);

INSERT INTO koha_plugin_com_lmscloud_eventmanagement_events (name, event_type, min_age, max_age, max_participants, start_time, end_time, registration_start, registration_end, location, description, status, registration_link, open_registration) VALUES
('Movie Night in the Park', 1, 0, 255, 50, '2023-06-10 20:00:00', '2023-06-10 22:00:00', '2023-05-10 12:00:00', '2023-06-10 19:00:00', 1, 'Watch a family-friendly movie in the park', 'confirmed', 'https://example.com/movie-night', 1),
('Art Workshop for Kids', 2, 5, 12, 10, '2023-07-01 10:00:00', '2023-07-01 12:00:00', '2023-06-15 12:00:00', '2023-06-30 23:59:59', 6, 'Learn how to paint and draw', 'confirmed', 'https://example.com/art-workshop', 0),
('Nature Walk in the National Park', 3, 18, 255, 25, '2023-08-05 09:00:00', '2023-08-05', '2023-08-05 12:00:00', '2023-07-01 12:00:00', 10, 'Take a guided nature walk in the beautiful national park', 'pending', NULL, 1),
('Science Fair for Teens', 4, 13, 19, 40, '2023-09-15 12:00:00', '2023-09-15 16:00:00', '2023-08-01 12:00:00', '2023-09-01 12:00:00', 7, 'Showcase your science projects and compete for prizes', 'pending', NULL, 0),
('Outdoor Concert', 1, 0, 255, 200, '2023-07-30 18:00:00', '2023-07-30 22:00:00', '2023-06-30 12:00:00', '2023-07-29 23:59:59', 5, 'Listen to live music under the stars', 'pending', NULL, 0),
('Art Workshop for Adults', 2, 18, 64, 15, '2023-05-20 14:00:00', '2023-05-20 16:00:00', '2023-05-01 12:00:00', '2023-05-19 23:59:59', 6, 'Learn how to paint and draw from a professional artist', 'confirmed', 'https://example.com/art-workshop', 1),
('Community Theater Performance', 1, 0, 255, 50, '2023-06-15 19:00:00', '2023-06-15 22:00:00', '2023-05-15 12:00:00', '2023-06-14 23:59:59', 4, 'Watch a live performance by the community theater group', 'confirmed', NULL, 0),
('City Beach Volleyball Tournament', 3, 18, 255, 20, '2023-07-22 10:00:00', '2023-07-22 16:00:00', '2023-06-22 12:00:00', '2023-07-21 23:59:59', 8, 'Compete in a beach volleyball tournament with teams from around the city', 'confirmed', 'https://example.com/volleyball-tournament', 1),
('Museum Tour for Seniors', 3, 65, 255, 15, '2023-09-01 11:00:00', '2023-09-01 13:00:00', '2023-08-15 12:00:00', '2023-08-31 23:59:59', 3, 'Take a guided tour of the museum with other seniors', 'pending', NULL, 1),
('Family Science Day', 4, 0, 12, 30, '2023-10-20 10:00:00', '2023-10-20 14:00:00', '2023-09-20 12:00:00', '2023-10-19 23:59:59', 7, 'Explore science with fun hands-on activities for the whole family', 'pending', NULL, 1),
('Concert in Paris', 1, 0, 255, 500, '2023-08-18 20:00:00', '2023-08-18 23:00:00', '2023-07-18 12:00:00', '2023-08-17 23:59:59', 6, 'Attend a concert in one of the most beautiful concert halls in the world', 'pending', NULL, 0),
('Art Exhibit Opening Reception', 2, 0, 255, 50, '2023-06-01 18:00:00', '2023-06-01 20:00:00', '2023-05-15 12:00:00', '2023-05-31 23:59:59', 2, "Celebrate the opening of a new art exhibit with wine and hors d'oeuvres", 'confirmed', NULL, 1),
("Children's Science Workshop", 4, 6, 12, 15, '2023-08-12 10:00:00', '2023-08-12 12:00:00', '2023-07-22 12:00:00', '2023-08-11 23:59:59', 4, 'Explore science with fun hands-on activities for kids', 'pending', NULL, 1),
('Movie Night at the Library', 1, 0, 255, 50, '2023-07-08 19:00:00', '2023-07-08 21:00:00', '2023-06-08 12:00:00', '2023-07-08 18:00:00', 2, 'Watch a classic movie at the library', 'confirmed', NULL, 0),
('Teen Art Club Meeting', 2, 13, 19, 10, '2023-05-25 16:00:00', '2023-05-25 18:00:00', '2023-05-15 12:00:00', '2023-05-25 15:59:59', 6, 'Hang out with other teens who love art and create something new', 'confirmed', NULL, 1),
('Guided City Tour for Adults', 3, 20, 64, 20, '2023-08-19 11:00:00', '2023-08-19 13:00:00', '2023-07-19 12:00:00', '2023-08-18 23:59:59', 1, 'Discover the history and culture of the city with a knowledgeable guide', 'pending', NULL, 1),
('Senior Book Club Meeting', 1, 65, 255, 10, '2023-06-10 14:00:00', '2023-06-10 16:00:00', '2023-05-20 12:00:00', '2023-06-10 13:59:59', 2, 'Discuss and share your thoughts on the latest book with other seniors', 'confirmed', NULL, 0),
('Nature Photography Workshop', 2, 18, 255, 15, '2023-09-09 10:00:00', '2023-09-09 12:00:00', '2023-08-09 12:00:00', '2023-09-08 23:59:59', 3, 'Learn how to take great nature photos from a professional photographer', 'pending', NULL, 1),
('Chess Tournament', 4, 12, 255, 20, '2023-10-01 10:00:00', '2023-10-01 16:00:00', '2023-09-15 12:00:00', '2023-09-30 23:59:59', 9, 'Compete in a chess tournament with players of all skill levels', 'pending', NULL, 0);

-- Seed the event target group fees table
INSERT INTO koha_plugin_com_lmscloud_eventmanagement_e_tg_fees (event_id, target_group_id, selected, fee) VALUES
(1, 1, 1, 0),
(2, 2, 1, 5),
(3, 1, 1, 0),
(4, 3, 1, 10),
(5, 1, 1, 0),
(6, 4, 1, 15),
(7, 1, 1, 0),
(8, 2, 1, 5),
(9, 1, 1, 0),
(10, 3, 1, 10),
(11, 1, 1, 0),
(12, 4, 1, 15),
(13, 1, 1, 0),
(14, 2, 1, 5),
(15, 1, 1, 0),
(16, 3, 1, 10),
(17, 1, 1, 0),
(18, 4, 1, 15),
(19, 1, 1, 0);

-- Seed the event type target group fees table
INSERT INTO koha_plugin_com_lmscloud_eventmanagement_et_tg_fees (event_type_id, target_group_id, selected, fee) VALUES
(1, 1, 1, 0),
(1, 2, 1, 5),
(1, 3, 1, 10),
(1, 4, 1, 15),
(2, 1, 1, 0),
(2, 2, 1, 5),
(2, 3, 1, 10),
(2, 4, 1, 15),
(3, 1, 1, 0),
(3, 2, 1, 5),
(3, 3, 1, 10),
(3, 4, 1, 15),
(4, 1, 1, 0),
(4, 2, 1, 5),
(4, 3, 1, 10),
(4, 4, 1, 15);
