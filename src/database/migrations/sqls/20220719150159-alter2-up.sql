/* Replace with your SQL commands */

ALTER TABLE IF EXISTS users
ALTER COLUMN created_at SET DEFAULT NOW();