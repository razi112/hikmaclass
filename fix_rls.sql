-- ============================================================
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Fix video_metadata write policies
drop policy if exists "Auth insert video_metadata" on public.video_metadata;
drop policy if exists "Auth update video_metadata" on public.video_metadata;
drop policy if exists "Auth delete video_metadata" on public.video_metadata;
drop policy if exists "Public insert video_metadata" on public.video_metadata;
drop policy if exists "Public update video_metadata" on public.video_metadata;
drop policy if exists "Public delete video_metadata" on public.video_metadata;

create policy "Public insert video_metadata"
  on public.video_metadata for insert with check (true);

create policy "Public update video_metadata"
  on public.video_metadata for update using (true) with check (true);

create policy "Public delete video_metadata"
  on public.video_metadata for delete using (true);

-- 2. Create image_metadata table if it doesn't exist yet
create table if not exists public.image_metadata (
  file_name text primary key,
  title     text not null,
  created_at timestamptz default now()
);

alter table public.image_metadata enable row level security;

drop policy if exists "Public read image_metadata" on public.image_metadata;
drop policy if exists "Authenticated insert image_metadata" on public.image_metadata;
drop policy if exists "Authenticated update image_metadata" on public.image_metadata;
drop policy if exists "Authenticated delete image_metadata" on public.image_metadata;
drop policy if exists "Public insert image_metadata" on public.image_metadata;
drop policy if exists "Public update image_metadata" on public.image_metadata;
drop policy if exists "Public delete image_metadata" on public.image_metadata;

create policy "Public read image_metadata"
  on public.image_metadata for select using (true);

create policy "Public insert image_metadata"
  on public.image_metadata for insert with check (true);

create policy "Public update image_metadata"
  on public.image_metadata for update using (true) with check (true);

create policy "Public delete image_metadata"
  on public.image_metadata for delete using (true);
