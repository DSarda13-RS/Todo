/* Replace with your SQL commands */

ALTER TABLE IF EXISTS sessiontable
ALTER COLUMN end_time SET DEFAULT NOW();
