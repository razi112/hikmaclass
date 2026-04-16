create table if not exists public.video_metadata (
  file_name text primary key,
  title text not null,
  thumbnail_url text,
  created_at timestamptz default now()
);

alter table public.video_metadata enable row level security;

-- Anyone can read
create policy "Public read video_metadata"
  on public.video_metadata for select using (true);

-- Allow all writes (admin check is done in app layer)
create policy "Public insert video_metadata"
  on public.video_metadata for insert
  with check (true);

create policy "Public update video_metadata"
  on public.video_metadata for update
  using (true);

create policy "Public delete video_metadata"
  on public.video_metadata for delete
  using (true);
