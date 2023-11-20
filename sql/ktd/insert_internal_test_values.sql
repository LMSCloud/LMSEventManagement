INSERT INTO koha_plugin_com_lmscloud_eventmanagement_target_groups (name, min_age, max_age) VALUES
('Group 0', 0, 10),
('Group 1', 11, 30),
('Group 2', 31, 60),
('Group 3', 61, 90),
('Group 4', 91, 120),
('Group 5', 121, 150),
('Group 6', 151, 180),
('Group 7', 181, 210),
('Group 8', 211, 220),
('Group 9', 221, 255);

INSERT INTO koha_plugin_com_lmscloud_eventmanagement_locations (name, street, number, city, zip, country) VALUES
('A_Location', 'A_Street', '0', 'A_City', '10000', 'A_country'),
('B_Location', 'B_Street', '1', 'B_City', '10001', 'B_country'),
('C_Location', 'C_Street', '2', 'C_City', '10002', 'C_country'),
('D_Location', 'D_Street', '3', 'D_City', '10003', 'D_country'),
('E_Location', 'E_Street', '4', 'E_City', '10004', 'E_country'),
('F_Location', 'F_Street', '5', 'F_City', '10005', 'F_country'),
('G_Location', 'G_Street', '6', 'G_City', '10006', 'G_country'),
('H_Location', 'H_Street', '7', 'H_City', '10007', 'H_country'),
('I_Location', 'I_Street', '8', 'I_City', '10008', 'I_country'),
('J_Location', 'J_Street', '9', 'J_City', '10009', 'J_country');

INSERT INTO koha_plugin_com_lmscloud_eventmanagement_event_types (name, min_age, max_age, max_participants, location, description, open_registration) VALUES
('A_Event_Type', 0, 255, 0, 0, 'A: Some description of your liking starting with A', 0),
('B_Event_Type', 1, 254, 50, 1, 'B: Some description of your liking starting with B', 1),
('C_Event_Type', 2, 253, 100, 2, 'C: Some description of your liking starting with C', 0),
('D_Event_Type', 3, 252, 150, 3, 'D: Some description of your liking starting with D', 1),
('E_Event_Type', 4, 251, 200, 4, 'E: Some description of your liking starting with E', 0),
('F_Event_Type', 5, 250, 250, 5, 'F: Some description of your liking starting with F', 1),
('G_Event_Type', 6, 249, 300, 6, 'G: Some description of your liking starting with G', 0),
('H_Event_Type', 7, 248, 350, 7, 'H: Some description of your liking starting with H', 1),
('I_Event_Type', 8, 247, 400, 8, 'I: Some description of your liking starting with I', 0),
('J_Event_Type', 9, 246, 450, 9, 'J: Some description of your liking starting with J', 1);

INSERT INTO koha_plugin_com_lmscloud_eventmanagement_events (name, event_type, min_age, max_age, max_participants, start_time, end_time, registration_start, registration_end, location, description, status, registration_link, open_registration) VALUES
('AA_Event', 1, 0, 255, 50, '2025-06-10 20:00:00', '2025-06-10 22:00:00', '2025-05-10 12:00:00', '2025-06-10 19:00:00', 1, 'Watch a family-friendly movie in the park (AA)', 'confirmed', 'https://example.com/movie-night', 1),
('AB_Event', 2, 5, 12, 10, '2025-07-01 10:00:00', '2025-07-01 12:00:00', '2025-06-15 12:00:00', '2025-06-30 23:59:59', 6, 'Learn how to paint and draw (AB)', 'confirmed', 'https://example.com/art-workshop', 0),
('AC_Event', 3, 18, 255, 25, '2025-08-05 09:00:00', '2025-08-05', '2025-08-05 12:00:00', '2025-07-01 12:00:00', 10, 'Take a guided nature walk in the beautiful national park (AC)', 'pending', NULL, 1),
('AD_Event', 4, 13, 19, 40, '2025-09-15 12:00:00', '2025-09-15 16:00:00', '2025-08-01 12:00:00', '2025-09-01 12:00:00', 7, 'Showcase your science projects and compete for prizes (AD)', 'pending', NULL, 0),
('AE_Event', 1, 0, 255, 200, '2025-07-30 18:00:00', '2025-07-30 22:00:00', '2025-06-30 12:00:00', '2025-07-29 23:59:59', 5, 'Listen to live music under the stars (AE)', 'pending', NULL, 0),
('AF_Event', 2, 18, 64, 15, '2025-05-20 14:00:00', '2025-05-20 16:00:00', '2025-05-01 12:00:00', '2025-05-19 23:59:59', 6, 'Learn how to paint and draw from a professional artist (AF)', 'confirmed', 'https://example.com/art-workshop', 1),
('AG_Event', 1, 0, 255, 50, '2025-06-15 19:00:00', '2025-06-15 22:00:00', '2025-05-15 12:00:00', '2025-06-14 23:59:59', 4, 'Watch a live performance by the community theater group (AG)', 'confirmed', NULL, 0),
('AH_Event', 3, 18, 255, 20, '2025-07-22 10:00:00', '2025-07-22 16:00:00', '2025-06-22 12:00:00', '2025-07-21 23:59:59', 8, 'Compete in a beach volleyball tournament with teams from around the city (AH)', 'confirmed', 'https://example.com/volleyball-tournament', 1),
('AI_Event', 3, 65, 255, 15, '2025-09-01 11:00:00', '2025-09-01 13:00:00', '2025-08-15 12:00:00', '2025-08-31 23:59:59', 3, 'Take a guided tour of the museum with other seniors (AI)', 'pending', NULL, 1),
('AJ_Event', 4, 0, 12, 30, '2025-10-20 10:00:00', '2025-10-20 14:00:00', '2025-09-20 12:00:00', '2025-10-19 23:59:59', 7, 'Explore science with fun hands-on activities for the whole family (AJ)', 'pending', NULL, 1),
('AK_Event', 1, 0, 255, 500, '2025-08-18 20:00:00', '2025-08-18 23:00:00', '2025-07-18 12:00:00', '2025-08-17 23:59:59', 6, 'Attend a concert in one of the most beautiful concert halls in the world (AK)', 'pending', NULL, 0),
('AL_Event', 2, 0, 255, 50, '2025-06-01 18:00:00', '2025-06-01 20:00:00', '2025-05-15 12:00:00', '2025-05-31 23:59:59', 2, "Celebrate the opening of a new art exhibit with wine and hors d'oeuvres (AL)", 'confirmed', NULL, 1),
('AM_Event', 4, 6, 12, 15, '2025-08-12 10:00:00', '2025-08-12 12:00:00', '2025-07-22 12:00:00', '2025-08-11 23:59:59', 4, 'Explore science with fun hands-on activities for kids (AM)', 'pending', NULL, 1),
('AN_Event', 1, 0, 255, 50, '2025-07-08 19:00:00', '2025-07-08 21:00:00', '2025-06-08 12:00:00', '2025-07-08 18:00:00', 2, 'Watch a classic movie at the library (AN)', 'confirmed', NULL, 0),
('AO_Event', 2, 13, 19, 10, '2025-05-25 16:00:00', '2025-05-25 18:00:00', '2025-05-15 12:00:00', '2025-05-25 15:59:59', 6, 'Hang out with other teens who love art and create something new (AO)', 'confirmed', NULL, 1),
('AP_Event', 3, 20, 64, 20, '2025-08-19 11:00:00', '2025-08-19 13:00:00', '2025-07-19 12:00:00', '2025-08-18 23:59:59', 1, 'Discover the history and culture of the city with a knowledgeable guide (AP)', 'pending', NULL, 1),
('AQ_Event', 1, 65, 255, 10, '2025-06-10 14:00:00', '2025-06-10 16:00:00', '2025-05-20 12:00:00', '2025-06-10 13:59:59', 2, 'Discuss and share your thoughts on the latest book with other seniors (AQ)', 'confirmed', NULL, 0),
('AR_Event', 2, 18, 255, 15, '2025-09-09 10:00:00', '2025-09-09 12:00:00', '2025-08-09 12:00:00', '2025-09-08 23:59:59', 3, 'Learn how to take great nature photos from a professional photographer (AR)', 'pending', NULL, 1),
('AS_Event', 4, 12, 255, 20, '2025-10-01 10:00:00', '2025-10-01 16:00:00', '2025-09-15 12:00:00', '2025-09-30 23:59:59', 9, 'Compete in a chess tournament with players of all skill levels (AS)', 'pending', NULL, 0),
('BA_Event', 1, 0, 255, 50, '2027-06-10 20:00:00', '2027-06-10 22:00:00', '2027-05-10 12:00:00', '2027-06-10 19:00:00', 1, 'Watch a family-friendly movie in the park (BA)', 'confirmed', 'https://example.com/movie-night', 1),
('BB_Event', 2, 5, 12, 10, '2027-07-01 10:00:00', '2027-07-01 12:00:00', '2027-06-15 12:00:00', '2027-06-30 23:59:59', 6, 'Learn how to paint and draw (BB)', 'confirmed', 'https://example.com/art-workshop', 0),
('BC_Event', 3, 18, 255, 25, '2027-08-05 09:00:00', '2027-08-05', '2027-08-05 12:00:00', '2027-07-01 12:00:00', 10, 'Take a guided nature walk in the beautiful national park (BC)', 'pending', NULL, 1),
('BD_Event', 4, 13, 19, 40, '2027-09-15 12:00:00', '2027-09-15 16:00:00', '2027-08-01 12:00:00', '2027-09-01 12:00:00', 7, 'Showcase your science projects and compete for prizes (BD)', 'pending', NULL, 0),
('BE_Event', 1, 0, 255, 200, '2027-07-30 18:00:00', '2027-07-30 22:00:00', '2027-06-30 12:00:00', '2027-07-29 23:59:59', 5, 'Listen to live music under the stars (BE)', 'pending', NULL, 0),
('BF_Event', 2, 18, 64, 15, '2027-05-20 14:00:00', '2027-05-20 16:00:00', '2027-05-01 12:00:00', '2027-05-19 23:59:59', 6, 'Learn how to paint and draw from a professional artist (BF)', 'confirmed', 'https://example.com/art-workshop', 1),
('BG_Event', 1, 0, 255, 50, '2027-06-15 19:00:00', '2027-06-15 22:00:00', '2027-05-15 12:00:00', '2027-06-14 23:59:59', 4, 'Watch a live performance by the community theater group (BG)', 'confirmed', NULL, 0),
('BH_Event', 3, 18, 255, 20, '2027-07-22 10:00:00', '2027-07-22 16:00:00', '2027-06-22 12:00:00', '2027-07-21 23:59:59', 8, 'Compete in a beach volleyball tournament with teams from around the city (BH)', 'confirmed', 'https://example.com/volleyball-tournament', 1),
('BI_Event', 3, 65, 255, 15, '2027-09-01 11:00:00', '2027-09-01 13:00:00', '2027-08-15 12:00:00', '2027-08-31 23:59:59', 3, 'Take a guided tour of the museum with other seniors (BI)', 'pending', NULL, 1),
('BJ_Event', 4, 0, 12, 30, '2027-10-20 10:00:00', '2027-10-20 14:00:00', '2027-09-20 12:00:00', '2027-10-19 23:59:59', 7, 'Explore science with fun hands-on activities for the whole family (BJ)', 'pending', NULL, 1),
('BK_Event', 1, 0, 255, 500, '2027-08-18 20:00:00', '2027-08-18 23:00:00', '2027-07-18 12:00:00', '2027-08-17 23:59:59', 6, 'Attend a concert in one of the most beautiful concert halls in the world (BK)', 'pending', NULL, 0),
('BL_Event', 2, 0, 255, 50, '2027-06-01 18:00:00', '2027-06-01 20:00:00', '2027-05-15 12:00:00', '2027-05-31 23:59:59', 2, "Celebrate the opening of a new art exhibit with wine and hors d'oeuvres (BL)", 'confirmed', NULL, 1),
('BM_Event', 4, 6, 12, 15, '2027-08-12 10:00:00', '2027-08-12 12:00:00', '2027-07-22 12:00:00', '2027-08-11 23:59:59', 4, 'Explore science with fun hands-on activities for kids (BM)', 'pending', NULL, 1),
('BN_Event', 1, 0, 255, 50, '2027-07-08 19:00:00', '2027-07-08 21:00:00', '2027-06-08 12:00:00', '2027-07-08 18:00:00', 2, 'Watch a classic movie at the library (BN)', 'confirmed', NULL, 0),
('BO_Event', 2, 13, 19, 10, '2027-05-25 16:00:00', '2027-05-25 18:00:00', '2027-05-15 12:00:00', '2027-05-25 15:59:59', 6, 'Hang out with other teens who love art and create something new (BO)', 'confirmed', NULL, 1),
('BP_Event', 3, 20, 64, 20, '2027-08-19 11:00:00', '2027-08-19 13:00:00', '2027-07-19 12:00:00', '2027-08-18 23:59:59', 1, 'Discover the history and culture of the city with a knowledgeable guide (BP)', 'pending', NULL, 1),
('BQ_Event', 1, 65, 255, 10, '2027-06-10 14:00:00', '2027-06-10 16:00:00', '2027-05-20 12:00:00', '2027-06-10 13:59:59', 2, 'Discuss and share your thoughts on the latest book with other seniors (BQ)', 'confirmed', NULL, 0),
('BR_Event', 2, 18, 255, 15, '2027-09-09 10:00:00', '2027-09-09 12:00:00', '2027-08-09 12:00:00', '2027-09-08 23:59:59', 3, 'Learn how to take great nature photos from a professional photographer (BR)', 'pending', NULL, 1),
('BS_Event', 4, 12, 255, 20, '2027-10-01 10:00:00', '2027-10-01 16:00:00', '2027-09-15 12:00:00', '2027-09-30 23:59:59', 9, 'Compete in a chess tournament with players of all skill levels (BS)', 'pending', NULL, 0);

INSERT INTO koha_plugin_com_lmscloud_eventmanagement_e_tg_fees (event_id, target_group_id, selected, fee) VALUES
-- Entries for AA_Event
(1, 1, 1, 0),
(1, 2, 1, 5),
(1, 3, 1, 10),
(1, 4, 1, 15),
-- Entries for AB_Event
(2, 2, 1, 5),
-- Entries for AC_Event
(3, 1, 1, 0),
(3, 2, 1, 5),
(3, 3, 1, 10),
(3, 4, 1, 15),
-- Entries for AD_Event
(4, 3, 1, 10),
-- Entries for AE_Event
(5, 1, 1, 0),
(5, 2, 1, 5),
(5, 3, 1, 10),
(5, 4, 1, 15),
-- Entries for AF_Event
(6, 4, 1, 15),
-- Entries for AG_Event
(7, 1, 1, 0),
(7, 2, 1, 5),
(7, 3, 1, 10),
(7, 4, 1, 15),
-- Entries for AH_Event
(8, 2, 1, 5),
-- Entries for AI_Event
(9, 1, 1, 0),
(9, 2, 1, 5),
(9, 3, 1, 10),
(9, 4, 1, 15),
-- Entries for AJ_Event
(10, 3, 1, 10),
-- Entries for AK_Event
(11, 1, 1, 0),
(11, 2, 1, 5),
(11, 3, 1, 10),
(11, 4, 1, 15),
-- Entries for AL_Event
(12, 4, 1, 15),
-- Entries for AM_Event
(13, 1, 1, 0),
(13, 2, 1, 5),
(13, 3, 1, 10),
(13, 4, 1, 15),
-- Entries for AN_Event
(14, 2, 1, 5),
-- Entries for AO_Event
(15, 1, 1, 0),
(15, 2, 1, 5),
(15, 3, 1, 10),
(15, 4, 1, 15),
-- Entries for AP_Event
(16, 3, 1, 10),
-- Entries for AQ_Event
(17, 1, 1, 0),
(17, 2, 1, 5),
(17, 3, 1, 10),
(17, 4, 1, 15),
-- Entries for AR_Event
(18, 4, 1, 15),
-- Entries for AS_Event
(19, 1, 1, 0),
(19, 2, 1, 5),
(19, 3, 1, 10),
(19, 4, 1, 15),
-- Entries for BA_Event
(20, 1, 1, 0),
(20, 2, 1, 5),
(20, 3, 1, 10),
(20, 4, 1, 15),
-- Entries for BB_Event
(21, 2, 1, 5),
-- Entries for BC_Event
(22, 1, 1, 0),
(22, 2, 1, 5),
(22, 3, 1, 10),
(22, 4, 1, 15),
-- Entries for BD_Event
(23, 3, 1, 10),
-- Entries for BE_Event
(24, 1, 1, 0),
(24, 2, 1, 5),
(24, 3, 1, 10),
(24, 4, 1, 15),
-- Entries for BF_Event
(25, 4, 1, 15),
-- Entries for BG_Event
(26, 1, 1, 0),
(26, 2, 1, 5),
(26, 3, 1, 10),
(26, 4, 1, 15),
-- Entries for BH_Event
(27, 2, 1, 5),
-- Entries for BI_Event
(28, 1, 1, 0),
(28, 2, 1, 5),
(28, 3, 1, 10),
(28, 4, 1, 15),
-- Entries for BJ_Event
(29, 3, 1, 10),
-- Entries for BK_Event
(30, 1, 1, 0),
(30, 2, 1, 5),
(30, 3, 1, 10),
(30, 4, 1, 15),
-- Entries for BL_Event
(31, 4, 1, 15),
-- Entries for BM_Event
(32, 1, 1, 0),
(32, 2, 1, 5),
(32, 3, 1, 10),
(32, 4, 1, 15),
-- Entries for BN_Event
(33, 2, 1, 5),
-- Entries for BO_Event
(34, 1, 1, 0),
(34, 2, 1, 5),
(34, 3, 1, 10),
(34, 4, 1, 15),
-- Entries for BP_Event
(35, 3, 1, 10),
-- Entries for BQ_Event
(36, 1, 1, 0),
(36, 2, 1, 5),
(36, 3, 1, 10),
(36, 4, 1, 15),
-- Entries for BR_Event
(37, 4, 1, 15),
-- Entries for BS_Event
(38, 1, 1, 0),
(38, 2, 1, 5),
(38, 3, 1, 10),
(38, 4, 1, 15);

-- Seed the event type target group fees table
INSERT INTO koha_plugin_com_lmscloud_eventmanagement_et_tg_fees (event_type_id, target_group_id, selected, fee) VALUES
-- Entries for A_Event_Type
(1, 1, 1, 0),
(1, 2, 1, 5),
(1, 3, 1, 10),
(1, 4, 1, 15),
-- Entries for B_Event_Type
(2, 1, 1, 0),
(2, 2, 1, 5),
(2, 3, 1, 10),
(2, 4, 1, 15),
-- Entries for C_Event_Type
(3, 1, 1, 0),
(3, 2, 1, 5),
(3, 3, 1, 10),
(3, 4, 1, 15),
-- Entries for D_Event_Type
(4, 1, 1, 0),
(4, 2, 1, 5),
(4, 3, 1, 10),
(4, 4, 1, 15),
-- Entries for E_Event_Type
(5, 1, 1, 0),
(5, 2, 1, 5),
(5, 3, 1, 10),
(5, 4, 1, 15),
-- Entries for F_Event_Type
(6, 1, 1, 0),
(6, 2, 1, 5),
(6, 3, 1, 10),
(6, 4, 1, 15),
-- Entries for G_Event_Type
(7, 1, 1, 0),
(7, 2, 1, 5),
(7, 3, 1, 10),
(7, 4, 1, 15),
-- Entries for H_Event_Type
(8, 1, 1, 0),
(8, 2, 1, 5),
(8, 3, 1, 10),
(8, 4, 1, 15),
-- Entries for I_Event_Type
(9, 1, 1, 0),
(9, 2, 1, 5),
(9, 3, 1, 10),
(9, 4, 1, 15),
-- Entries for J_Event_Type
(10, 1, 1, 0),
(10, 2, 1, 5),
(10, 3, 1, 10),
(10, 4, 1, 15);