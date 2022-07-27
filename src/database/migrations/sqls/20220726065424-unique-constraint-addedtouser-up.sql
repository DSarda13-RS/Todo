/* Replace with your SQL commands */

TRUNCATE sessiontable, todo, users;

ALTER TABLE IF EXISTS users
ADD CONSTRAINT email_unique UNIQUE(email),
ADD CONSTRAINT username_unique UNIQUE(username);
