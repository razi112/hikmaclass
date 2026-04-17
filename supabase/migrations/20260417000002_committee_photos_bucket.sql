-- Create committee-photos storage bucket
insert into storage.buckets (id, name, public)
values ('committee-photos', 'committee-photos', true)
on conflict (id) do nothing;

-- Drop existing policies if re-running
drop policy if exists "Public read committee photos" on storage.objects;
drop policy if exists "Auth upload committee photos" on storage.objects;
drop policy if exists "Auth delete committee photos" on storage.objects;

-- Allow public read
create policy "Public read committee photos"
  on storage.objects for select
  using (bucket_id = 'committee-photos');

-- Allow anyone to upload (app uses custom auth, not Supabase auth)
create policy "Allow upload committee photos"
  on storage.objects for insert
  with check (bucket_id = 'committee-photos');

-- Allow anyone to delete
create policy "Allow delete committee photos"
  on storage.objects for delete
  using (bucket_id = 'committee-photos');
