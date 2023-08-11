-- Seed the target groups table
INSERT INTO koha_plugin_com_lmscloud_eventmanagement_target_groups (name, min_age, max_age) VALUES
('Kinder', 0, 12),
('Teenager', 13, 19),
('Erwachsene', 20, 64),
('Senioren', 65, 255);

-- Seed the locations table
INSERT INTO koha_plugin_com_lmscloud_eventmanagement_locations (name, street, number, city, zip, country) VALUES
('Stadtpark', 'Hauptstraße', '1', 'Wallenheim', '12345', 'Deutschland'),
('Zentrale Bibliothek', 'Parkweg', '100', 'Wallenheim', '12345', 'Deutschland'),
('Naturhistorisches Museum', 'Zentralallee', '79', 'Wallenheim', '12345', 'Deutschland'),
('Gemeindezentrum', 'Eichenstraße', '500', 'Wallenheim', '12345', 'Deutschland'),
('Konzertsaal', 'Bachweg', '221B', 'Wallenheim', '12345', 'Deutschland'),
('Kunstgalerie', 'Kunststraße', '9', 'Wallenheim', '12345', 'Deutschland'),
('Wissenschaftsmuseum', 'Ausstellungsallee', '1', 'Wallenheim', '12345', 'Deutschland'),
('Stadtstrand', 'Strandweg', '1', 'Wallenheim', '12345', 'Deutschland'),
('Zoo', 'Riehentorstraße', '31', 'Wallenheim', '12345', 'Deutschland'),
('Naturpark', 'Naturweg', '1', 'Wallenheim', '12345', 'Deutschland');

-- Seed the event types table
INSERT INTO koha_plugin_com_lmscloud_eventmanagement_event_types (name, min_age, max_age, max_participants, location, description, image, open_registration) VALUES
('Filmabend', 0, 255, 100, 1, 'Genießen Sie einen Film unter freiem Himmel', 'https://lorem.picsum/400/300', 1),
('Kunstworkshop', 10, 255, 20, 6, 'Kreieren Sie Ihr eigenes Meisterwerk', 'https://lorem.picsum/400/300', 0),
('Naturwanderung', 18, 255, 30, 10, 'Erkunden Sie die Schönheit der Natur', 'https://lorem.picsum/400/300', 1),
('Wissenschaftsmesse', 6, 18, 50, 7, 'Entdecken Sie die Wunder der Wissenschaft', 'https://lorem.picsum/400/300', 0);

-- Seed the events table
INSERT INTO koha_plugin_com_lmscloud_eventmanagement_events (name, event_type, min_age, max_age, max_participants, start_time, end_time, registration_start, registration_end, location, image, description, status, registration_link, open_registration) VALUES
('Filmabend im Stadtpark', 1, 0, 255, 50, '2023-06-10 20:00:00', '2023-06-10 22:00:00', '2023-05-10 12:00:00', '2023-06-10 19:00:00', 1,'https://picsum.photos/400/300', 'Schauen Sie einen familienfreundlichen Film im Stadtpark', 'confirmed', 'https://example.com/filmabend', 1),
('Kunstworkshop für Kinder', 2, 5, 12, 10, '2023-07-01 10:00:00', '2023-07-01 12:00:00', '2023-06-15 12:00:00', '2023-06-30 23:59:59', 6,'https://picsum.photos/400/300', 'Lernen Sie malen und zeichnen', 'confirmed', 'https://example.com/kunstworkshop', 0),
('Naturwanderung im Naturpark', 3, 18, 255, 25, '2023-08-05 09:00:00', '2023-08-05 12:00:00', '2023-07-01 12:00:00', '2023-08-04 23:59:59', 10,'https://picsum.photos/400/300', 'Nehmen Sie an einer geführten Naturwanderung im wunderschönen Naturpark teil', 'pending', 'https://example.com/naturwanderung', 1),
('Wissenschaftsmesse für Teenager', 4, 13, 19, 40, '2023-09-15 12:00:00', '2023-09-15 16:00:00', '2023-08-01 12:00:00', '2023-09-01 12:00:00', 7,'https://picsum.photos/400/300', 'Präsentieren Sie Ihre wissenschaftlichen Projekte und konkurrieren Sie um Preise', 'pending', 'https://example.com/wissenschaftsmesse', 0),
('Open-Air-Konzert', 1, 0, 255, 200, '2023-07-30 18:00:00', '2023-07-30 22:00:00', '2023-06-30 12:00:00', '2023-07-29 23:59:59', 5,'https://picsum.photos/400/300', 'Lauschen Sie Live-Musik unter freiem Himmel', 'pending', 'https://example.com/open-air-konzert', 0),
('Kunstworkshop für Erwachsene', 2, 18, 64, 15, '2023-05-20 14:00:00', '2023-05-20 16:00:00', '2023-05-01 12:00:00', '2023-05-19 23:59:59', 6,'https://picsum.photos/400/300', 'Lernen Sie malen und zeichnen von einem professionellen Künstler', 'confirmed', 'https://beispiel.de/kunstworkshop', 1),
('Theateraufführung im Gemeindezentrum', 1, 0, 255, 50, '2023-06-15 19:00:00', '2023-06-15 22:00:00', '2023-05-15 12:00:00', '2023-06-14 23:59:59', 4,'https://picsum.photos/400/300', 'Sehen Sie eine Live-Aufführung der örtlichen Theatergruppe', 'confirmed', 'https://example.com/theater', 0),
('Volleyballturnier am Stadtstrand', 3, 18, 255, 20, '2023-07-22 10:00:00', '2023-07-22 16:00:00', '2023-06-22 12:00:00', '2023-07-21 23:59:59', 8,'https://picsum.photos/400/300', 'Nehmen Sie an einem Volleyballturnier mit Teams aus der ganzen Stadt teil', 'confirmed', 'https://beispiel.de/volleyballturnier', 1),
('Museumsführung für Senioren', 3, 65, 255, 15, '2023-09-01 11:00:00', '2023-09-01 13:00:00', '2023-08-15 12:00:00', '2023-08-31 23:59:59', 3,'https://picsum.photos/400/300', 'Nehmen Sie an einer geführten Tour durch das Museum mit anderen Senioren teil', 'pending', 'https://example.com/museumsfuehrung', 1),
('Familiensciencetag', 4, 0, 12, 30, '2023-10-20 10:00:00', '2023-10-20 14:00:00', '2023-09-20 12:00:00', '2023-10-19 23:59:59', 7,'https://picsum.photos/400/300', 'Entdecken Sie Wissenschaft mit unterhaltsamen praktischen Aktivitäten für die ganze Familie', 'pending', 'https://example.com/sciencetag', 1),
('Konzert in Wallenheim', 1, 0, 255, 500, '2023-08-18 20:00:00', '2023-08-18 23:00:00', '2023-07-18 12:00:00', '2023-08-17 23:59:59', 6,'https://picsum.photos/400/300', 'Besuchen Sie ein Konzert in einem der schönsten Konzertsäle der Welt', 'pending', 'https://example.com/konzert', 0),
('Eröffnungsfeier der Kunstausstellung', 2, 0, 255, 50, '2023-06-01 18:00:00', '2023-06-01 20:00:00', '2023-05-15 12:00:00', '2023-05-31 23:59:59', 2,'https://picsum.photos/400/300', 'Feiern Sie die Eröffnung einer neuen Kunstausstellung mit Wein und Häppchen', 'confirmed', 'https://example.com/austellungseroeffnung', 1),
('Naturwissenschaftlicher Workshop für Kinder', 4, 6, 12, 15, '2023-08-12 10:00:00', '2023-08-12 12:00:00', '2023-07-22 12:00:00', '2023-08-11 23:59:59', 4,'https://picsum.photos/400/300', 'Entdecken Sie Wissenschaft mit unterhaltsamen praktischen Aktivitäten für Kinder', 'pending', 'https://example.com/wissenschaftsworkshop', 1),
('Filmabend in der Bibliothek', 1, 0, 255, 50, '2023-07-08 19:00:00', '2023-07-08 21:00:00', '2023-06-08 12:00:00', '2023-07-08 18:00:00', 2,'https://picsum.photos/400/300', 'Sehen Sie einen klassischen Film in der Bibliothek', 'confirmed', 'https://example.com/filmabend', 0),
('Treffen des Teenager-Kunstclubs', 2, 13, 19, 10, '2023-05-25 16:00:00', '2023-05-25 18:00:00', '2023-05-15 12:00:00', '2023-05-25 15:59:59', 6,'https://picsum.photos/400/300', 'Treffen Sie sich mit anderen Jugendlichen, die Kunst lieben, und kreieren Sie etwas Neues', 'confirmed', 'https://example.com/kunstworkshop', 1),
('Stadtführung für Erwachsene', 3, 20, 64, 20, '2023-08-19 11:00:00', '2023-08-19 13:00:00', '2023-07-19 12:00:00', '2023-08-18 23:59:59', 1,'https://picsum.photos/400/300', 'Entdecken Sie die Geschichte und Kultur der Stadt mit einem sachkundigen Führer', 'pending', 'https://example.com/stadtfuehrung', 1),
('Treffen des Senioren-Buchclubs', 1, 65, 255, 10, '2023-06-10 14:00:00', '2023-06-10 16:00:00', '2023-05-20 12:00:00', '2023-06-10 13:59:59', 2,'https://picsum.photos/400/300', 'Diskutieren und teilen Sie Ihre Gedanken zum neuesten Buch mit anderen Senioren', 'confirmed', 'https://example.com/buchclub', 0),
('Naturfotografie-Workshop', 2, 18, 255, 15, '2023-09-09 10:00:00', '2023-09-09 12:00:00', '2023-08-09 12:00:00', '2023-09-08 23:59:59', 3,'https://picsum.photos/400/300', 'Lernen Sie von einem professionellen Fotografen, wie man großartige Naturfotos macht', 'pending', 'https://example.com/fotografieworkshop', 1),
('Schachturnier', 4, 12, 255, 20, '2023-10-01 10:00:00', '2023-10-01 16:00:00', '2023-09-15 12:00:00', '2023-09-30 23:59:59', 9,'https://picsum.photos/400/300', 'Nehmen Sie an einem Schachturnier mit Spielern aller Fähigkeitsstufen teil', 'pending', 'https://example.com/schachturnier', 0);

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
