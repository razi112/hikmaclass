-- Add missing delete policy for students table
drop policy if exists "Anyone can delete students" on public.students;
create policy "Anyone can delete students"
  on public.students for delete
  using (true);
