/* Replace with your SQL commands */

create table if not exists users
(
    id        serial primary key,
    name      text,
    email     text,
    username text,
    password text,
    created_at date,
    updated_at date,
    deleted_at date
);