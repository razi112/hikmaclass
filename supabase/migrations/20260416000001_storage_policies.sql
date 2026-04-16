-- Ensure buckets exist and are public
insert into storage.buckets (id, name, public)
values ('gallery-videos', 'gallery-videos', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('gallery-thumbnails', 'gallery-thumbnails', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('gallery-images', 'gallery-images', true)
on conflict (id) do update set public = true;

-- Drop old policies
drop policy if exists "Public read gallery-videos" on storage.objects;
drop policy if exists "Admin insert gallery-videos" on storage.objects;
drop policy if exists "Admin delete gallery-videos" on storage.objects;
drop policy if exists "Public read gallery-thumbnails" on storage.objects;
drop policy if exists "Admin insert gallery-thumbnails" on storage.objects;
drop policy if exists "Admin delete gallery-thumbnails" on storage.objects;
drop policy if exists "Public read gallery-images" on storage.objects;
drop policy if exists "Admin insert gallery-images" on storage.objects;
drop policy if exists "Admin delete gallery-images" on storage.objects;

-- gallery-videos: public read, authenticated users can insert/delete
create policy "Public read gallery-videos"
  on storage.objects for select using (bucket_id = 'gallery-videos');

-- gallery-videos: public read, allow insert/delete (for demo admin)
create policy "Public insert gallery-videos"
  on storage.objects for insert
  with check (bucket_id = 'gallery-videos');

create policy "Public delete gallery-videos"
  on storage.objects for delete
  using (bucket_id = 'gallery-videos');

-- gallery-thumbnails
create policy "Public read gallery-thumbnails"
  on storage.objects for select using (bucket_id = 'gallery-thumbnails');

create policy "Public insert gallery-thumbnails"
  on storage.objects for insert
  with check (bucket_id = 'gallery-thumbnails');

create policy "Public delete gallery-thumbnails"
  on storage.objects for delete
  using (bucket_id = 'gallery-thumbnails');

-- gallery-images
create policy "Public read gallery-images"
  on storage.objects for select using (bucket_id = 'gallery-images');

create policy "Public insert gallery-images"
  on storage.objects for insert
  with check (bucket_id = 'gallery-images');

create policy "Public delete gallery-images"
  on storage.objects for delete
  using (bucket_id = 'gallery-images');
