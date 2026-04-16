-- Events table
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  date        text,
  time        text,
  location    text,
  category    text default 'social',
  image_url   text,
  created_at  timestamptz default now()
);
alter table public.events enable row level security;
create policy "Public read events"  on public.events for select using (true);
create policy "Public insert events" on public.events for insert with check (true);
create policy "Public update events" on public.events for update using (true);
create policy "Public delete events" on public.events for delete using (true);

-- News table
create table if not exists public.news (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  excerpt     text,
  date        text,
  author      text default 'Admin',
  category    text,
  created_at  timestamptz default now()
);
alter table public.news enable row level security;
create policy "Public read news"   on public.news for select using (true);
create policy "Public insert news" on public.news for insert with check (true);
create policy "Public update news" on public.news for update using (true);
create policy "Public delete news" on public.news for delete using (true);

-- event-images storage bucket
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do update set public = true;

create policy "Public read event-images"   on storage.objects for select using (bucket_id = 'event-images');
create policy "Public insert event-images" on storage.objects for insert with check (bucket_id = 'event-images');
create policy "Public delete event-images" on storage.objects for delete using (bucket_id = 'event-images');
