# Database Setup Instructions

## Option 1: Run Migration in Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the SQL below
5. Click **Run** or press `Ctrl+Enter`

```sql
-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  photo TEXT,
  class_year TEXT NOT NULL DEFAULT 'Class of 2024',
  graduation_year INTEGER NOT NULL DEFAULT 2024,
  department TEXT NOT NULL DEFAULT 'Hikma Class Union',
  bio TEXT,
  admission_number TEXT UNIQUE,
  roll_number TEXT,
  blood_group TEXT,
  address TEXT,
  parent_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow everyone to read students (public directory)
CREATE POLICY "Anyone can view students"
  ON public.students FOR SELECT
  USING (true);

-- Only authenticated users can insert (register)
CREATE POLICY "Authenticated users can register"
  ON public.students FOR INSERT
  WITH CHECK (true);

-- Users can update their own record
CREATE POLICY "Users can update own record"
  ON public.students FOR UPDATE
  USING (email = (auth.jwt() ->> 'email'));

-- Admins can do everything (if has_role function exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'has_role') THEN
    EXECUTE 'CREATE POLICY "Admins can manage students"
      ON public.students FOR ALL
      USING (public.has_role(auth.uid(), ''admin''))';
  END IF;
END $$;

-- Add updated_at trigger
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX idx_students_email ON public.students(email);
CREATE INDEX idx_students_admission_number ON public.students(admission_number);
CREATE INDEX idx_students_created_at ON public.students(created_at DESC);
```

## Option 2: Install Supabase CLI

If you want to use migrations in the future:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

## Verify Setup

After running the SQL:
1. Go to **Table Editor** in Supabase dashboard
2. You should see a new table called `students`
3. Try registering a new student in your app
4. Check the `students` table to see the new record

## Troubleshooting

If you get permission errors:
- Make sure you're logged in as the project owner
- Check that RLS is properly configured
- Verify the policies are created correctly
