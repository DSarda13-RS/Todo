/* Replace with your SQL commands */

ALTER TABLE IF EXISTS todo
ALTER COLUMN created_at SET DEFAULT NOW(),
ALTER COLUMN mark_completed SET DEFAULT false;
