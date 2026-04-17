-- Create student-photos bucket
insert into storage.buckets (id, name, public)
values ('student-photos', 'student-photos', true)
on conflict (id) do update set public = true;

-- Drop old policies if any
drop policy if exists "Public read student-photos" on storage.objects;
drop policy if exists "Public insert student-photos" on storage.objects;
drop policy if exists "Public delete student-photos" on storage.objects;

-- Public read
create policy "Public read student-photos"
  on storage.objects for select using (bucket_id = 'student-photos');

-- Allow insert (admin dashboard uses local auth, not Supabase auth)
create policy "Public insert student-photos"
  on storage.objects for insert
  with check (bucket_id = 'student-photos');

-- Allow delete
create policy "Public delete student-photos"
  on storage.objects for delete
  using (bucket_id = 'student-photos');

-- Allow admin to update student photo column
drop policy if exists "Anyone can update student photo" on public.students;
create policy "Anyone can update student photo"
  on public.students for update
  using (true)
  with check (true);
