import { supabase } from '@/integrations/supabase/client';

export interface Student {
  id: string;
  name: string;
  photo: string;
  email: string;
  phone?: string;
  classYear: string;
  graduationYear: number;
  department: string;
  bio?: string;
  role?: string;
  admissionNumber?: string;
  rollNumber?: string;
  bloodGroup?: string;
  address?: string;
  parentName?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: 'reunion' | 'seminar' | 'social' | 'fundraiser';
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
  category: string;
}

// Generate initials avatar URL
const getAvatarUrl = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e3a5f&color=fff&size=300&font-size=0.4&bold=true`;
};

// Empty students array - will be populated from Supabase
export const sampleStudents: Student[] = [];

// Helper function to get students from Supabase
export const getRegisteredStudents = async (): Promise<Student[]> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('Supabase table "students" not found (PGRST205). Please apply the SQL migrations in supabase/migrations/ to your database. Returning empty list.');
      } else {
        console.error('Error fetching students:', error);
      }
      return [];
    }

    // Transform database format to Student interface
    return (data || []).map((student: any) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      photo: student.photo || getAvatarUrl(student.name),
      classYear: student.class_year,
      graduationYear: student.graduation_year,
      department: student.department,
      bio: student.bio,
      role: student.role,
      admissionNumber: student.admission_number,
      rollNumber: student.roll_number,
      bloodGroup: student.blood_group,
      address: student.address,
      parentName: student.parent_name,
    }));
  } catch (error) {
    console.error('Error in getRegisteredStudents:', error);
    return [];
  }
};

// Helper function to add a new student to Supabase
export const addStudent = async (student: Omit<Student, 'id'>): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('students')
      .insert([{
        name: student.name,
        email: student.email,
        phone: student.phone,
        photo: student.photo,
        class_year: student.classYear,
        graduation_year: student.graduationYear,
        department: student.department,
        bio: student.bio,
        role: student.role,
        admission_number: student.admissionNumber,
        roll_number: student.rollNumber,
        blood_group: student.bloodGroup,
        address: student.address,
        parent_name: student.parentName,
      }]);

    if (error) {
      console.error('Error adding student:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in addStudent:', error);
    return { success: false, error: error.message };
  }
};

export const sampleEvents: Event[] = [];

export const sampleNews: NewsItem[] = [];

export const departments = [
  'All Departments',
  'Hikma Class Union',
];

export const graduationYears = [
  'All Years',
  '2026',
  '2023',
  '2022',
  '2021',
  '2020',
];
