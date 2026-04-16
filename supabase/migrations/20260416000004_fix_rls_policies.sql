-- Fix video_metadata: drop restrictive policies, allow public writes
drop policy if exists "Auth insert video_metadata" on public.video_metadata;
drop policy if exists "Auth update video_metadata" on public.video_metadata;
drop policy if exists "Auth delete video_metadata" on public.video_metadata;
drop policy if exists "Public insert video_metadata" on public.video_metadata;
drop policy if exists "Public update video_metadata" on public.video_metadata;
drop policy if exists "Public delete video_metadata" on public.video_metadata;

create policy "Public insert video_metadata"
  on public.video_metadata for insert with check (true);

create policy "Public update video_metadata"
  on public.video_metadata for update using (true);

create policy "Public delete video_metadata"
  on public.video_metadata for delete using (true);

-- Fix image_metadata: same pattern (in case table exists)
drop policy if exists "Authenticated insert image_metadata" on public.image_metadata;
drop policy if exists "Authenticated update image_metadata" on public.image_metadata;
drop policy if exists "Authenticated delete image_metadata" on public.image_metadata;
drop policy if exists "Public insert image_metadata" on public.image_metadata;
drop policy if exists "Public update image_metadata" on public.image_metadata;
drop policy if exists "Public delete image_metadata" on public.image_metadata;

create policy "Public insert image_metadata"
  on public.image_metadata for insert with check (true);

create policy "Public update image_metadata"
  on public.image_metadata for update using (true);

create policy "Public delete image_metadata"
  on public.image_metadata for delete using (true);
