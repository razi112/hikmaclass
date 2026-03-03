-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view students" ON public.students;
DROP POLICY IF EXISTS "Authenticated users can register" ON public.students;
DROP POLICY IF EXISTS "Users can update own record" ON public.students;
DROP POLICY IF EXISTS "Admins can manage students" ON public.students;

-- RLS Policies - Allow everyone to read students (public directory)
CREATE POLICY "Anyone can view students"
  ON public.students FOR SELECT
  USING (true);

-- Allow anyone to insert (register) - no auth required for registration
CREATE POLICY "Anyone can register"
  ON public.students FOR INSERT
  WITH CHECK (true);

-- Users can update their own record by email
CREATE POLICY "Users can update own record"
  ON public.students FOR UPDATE
  USING (email = (auth.jwt() ->> 'email'));

-- Admins can do everything (only if has_role function exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'has_role') THEN
    EXECUTE 'CREATE POLICY "Admins can manage students"
      ON public.students FOR ALL
      USING (public.has_role(auth.uid(), ''admin''))';
  END IF;
END $$;

-- Add updated_at trigger (only if update_updated_at_column function exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
    EXECUTE 'CREATE TRIGGER update_students_updated_at
      BEFORE UPDATE ON public.students
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()';
  END IF;
END $$;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_students_admission_number ON public.students(admission_number);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON public.students(created_at DESC);
