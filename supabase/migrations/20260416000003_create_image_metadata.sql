create table if not exists public.image_metadata (
  file_name text primary key,
  title     text not null,
  created_at timestamptz default now()
);

alter table public.image_metadata enable row level security;

-- Anyone can read
create policy "Public read image_metadata"
  on public.image_metadata for select using (true);

-- Allow all (admin check is done in app layer, same as video_metadata)
create policy "Public insert image_metadata"
  on public.image_metadata for insert with check (true);

create policy "Public update image_metadata"
  on public.image_metadata for update using (true);

create policy "Public delete image_metadata"
  on public.image_metadata for delete using (true);
