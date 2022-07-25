/* Replace with your SQL commands */

create table if not exists todo
(
    id serial primary key,
    user_id int references users(id),
    description text,
    created_at date,
    updated_at date,
    deleted_at date
);