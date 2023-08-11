-- Move dates 1 month later for start_time, end_time, registration_start, and registration_end
UPDATE koha_plugin_com_lmscloud_eventmanagement_events
SET start_time = DATE_ADD(start_time, INTERVAL 1 MONTH),
    end_time = DATE_ADD(end_time, INTERVAL 1 MONTH),
    registration_start = CASE
        WHEN registration_start IS NOT NULL THEN DATE_ADD(registration_start, INTERVAL 1 MONTH)
        ELSE NULL
    END,
    registration_end = CASE
        WHEN registration_end IS NOT NULL THEN DATE_ADD(registration_end, INTERVAL 1 MONTH)
        ELSE NULL
    END;