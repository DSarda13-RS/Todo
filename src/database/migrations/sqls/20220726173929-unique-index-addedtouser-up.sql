/* Replace with your SQL commands */

ALTER TABLE IF EXISTS users
DROP CONSTRAINT email_unique,
DROP CONSTRAINT username_unique;

CREATE UNIQUE INDEX unique_user on users(email,username)
WHERE deleted_at IS NULL;

