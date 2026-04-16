-- Ensure gallery-images bucket exists and is public
insert into storage.buckets (id, name, public)
values ('gallery-images', 'gallery-images', true)
on conflict (id) do update set public = true;

-- Drop any conflicting policies first
drop policy if exists "Public read gallery-images" on storage.objects;
drop policy if exists "Public insert gallery-images" on storage.objects;
drop policy if exists "Public delete gallery-images" on storage.objects;
drop policy if exists "Admin insert gallery-images" on storage.objects;
drop policy if exists "Admin delete gallery-images" on storage.objects;

-- Allow anyone to read images
create policy "Public read gallery-images"
  on storage.objects for select
  using (bucket_id = 'gallery-images');

-- Allow anyone to upload images (admin auth handled at app layer)
create policy "Public insert gallery-images"
  on storage.objects for insert
  with check (bucket_id = 'gallery-images');

-- Allow anyone to delete images
create policy "Public delete gallery-images"
  on storage.objects for delete
  using (bucket_id = 'gallery-images');
