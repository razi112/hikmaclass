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

export const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Annual Alumni Reunion 2024',
    description: 'Join us for our biggest gathering of the year! Reconnect with old friends, make new connections, and celebrate our shared heritage.',
    date: '2024-06-15',
    time: '4:00 PM',
    location: 'Grand Ballroom, Lagos Continental Hotel',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    category: 'reunion'
  },
  {
    id: '2',
    title: 'Career Development Workshop',
    description: 'Expert-led workshop on advancing your career in the modern workplace. Topics include leadership, networking, and industry trends.',
    date: '2024-05-20',
    time: '10:00 AM',
    location: 'Virtual Event - Zoom',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    category: 'seminar'
  },
  {
    id: '3',
    title: 'Scholarship Fundraiser Gala',
    description: 'An elegant evening to raise funds for student scholarships. Dinner, entertainment, and silent auction.',
    date: '2024-07-10',
    time: '7:00 PM',
    location: 'Eko Hotel & Suites',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop',
    category: 'fundraiser'
  },
];

export const sampleNews: NewsItem[] = [
  {
    id: '1',
    title: 'Hikma Alumni Wins National Innovation Award',
    excerpt: 'Congratulations to our alumna for winning the prestigious National Tech Innovation Award for groundbreaking work in AI.',
    content: 'Full article content here...',
    date: '2024-03-15',
    author: 'Admin',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
    category: 'Achievement'
  },
  {
    id: '2',
    title: 'New Partnership with Tech Companies',
    excerpt: 'Hikma Class Union announces partnerships with leading tech companies to provide internship opportunities for current students.',
    content: 'Full article content here...',
    date: '2024-03-10',
    author: 'Admin',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
    category: 'Announcement'
  },
  {
    id: '3',
    title: 'Community Service Initiative Launched',
    excerpt: 'Join our new community service program aimed at mentoring underprivileged students in local schools.',
    content: 'Full article content here...',
    date: '2024-03-05',
    author: 'Admin',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=400&fit=crop',
    category: 'Community'
  },
];

export const departments = [
  'All Departments',
  'Hikma Class Union',
];

export const graduationYears = [
  'All Years',
  '2024',
  '2023',
  '2022',
  '2021',
  '2020',
];
