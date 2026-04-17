-- Fix video_metadata RLS: drop and recreate all policies to allow unauthenticated access
alter table public.video_metadata disable row level security;

-- Re-enable with permissive policies
alter table public.video_metadata enable row level security;

drop policy if exists "Public read video_metadata" on public.video_metadata;
drop policy if exists "Public insert video_metadata" on public.video_metadata;
drop policy if exists "Public update video_metadata" on public.video_metadata;
drop policy if exists "Public delete video_metadata" on public.video_metadata;

create policy "Public read video_metadata"
  on public.video_metadata for select using (true);

create policy "Public insert video_metadata"
  on public.video_metadata for insert with check (true);

create policy "Public update video_metadata"
  on public.video_metadata for update using (true) with check (true);

create policy "Public delete video_metadata"
  on public.video_metadata for delete using (true);
