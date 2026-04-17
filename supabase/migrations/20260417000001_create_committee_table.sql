-- Create committee_members table
create table if not exists public.committee_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  photo text default '',
  created_at timestamptz default now()
);

alter table public.committee_members enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Public read committee" on public.committee_members;
drop policy if exists "Admin insert committee" on public.committee_members;
drop policy if exists "Admin update committee" on public.committee_members;
drop policy if exists "Admin delete committee" on public.committee_members;

-- Public read
create policy "Public read committee" on public.committee_members
  for select using (true);

-- Allow all writes (app uses custom localStorage auth, not Supabase auth)
create policy "Allow all insert committee" on public.committee_members
  for insert with check (true);

create policy "Allow all update committee" on public.committee_members
  for update using (true);

create policy "Allow all delete committee" on public.committee_members
  for delete using (true);

-- Seed initial members (skip if already seeded)
insert into public.committee_members (name, position)
select name, position from (values
  ('Yaseen',  'President'),
  ('Ameen',   'Secretary'),
  ('Rayyan',  'Treasurer'),
  ('Shehin',  'Vice President'),
  ('Razi',    'Joint Secretary'),
  ('Anas',    'Working Secretary')
) as t(name, position)
where not exists (select 1 from public.committee_members limit 1);
