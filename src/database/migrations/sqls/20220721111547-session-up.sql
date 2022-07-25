/* Replace with your SQL commands */

create table if not exists sessionTable
(
    session_id        serial primary key,
    user_id      int references users(id) not null,
    start_time     timestamp default now(),
    end_time    timestamp,
    is_ended    boolean default false
);