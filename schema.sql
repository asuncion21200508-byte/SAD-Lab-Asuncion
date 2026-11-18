-- Run this in Supabase: SQL Editor > New query > Run
create table if not exists public.students (
  id          bigint generated always as identity primary key,
  student_id  text not null unique,
  full_name   text not null,
  program     text not null,
  year_level  text not null,
  email       text not null,
  created_at  timestamptz default now()
);

-- Lab only: allow the public (anon) key to do CRUD.
alter table public.students enable row level security;
create policy "lab_all_access" on public.students
  for all to anon using (true) with check (true);

-- Five sample records
insert into public.students (student_id, full_name, program, year_level, email) values
 ('2023-0001','Maria Santos','BS Information Technology','2nd Year','maria.santos@school.edu'),
 ('2023-0002','Juan Dela Cruz','BS Computer Science','3rd Year','juan.delacruz@school.edu'),
 ('2024-0003','Ana Reyes','BS Information Systems','1st Year','ana.reyes@school.edu'),
 ('2022-0004','Carlo Mendoza','BS Information Technology','4th Year','carlo.mendoza@school.edu'),
 ('2024-0005','Liza Villanueva','BS Computer Science','1st Year','liza.villanueva@school.edu')
on conflict (student_id) do nothing;
