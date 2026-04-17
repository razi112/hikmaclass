import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { StudentCard } from '@/components/cards/StudentCard';
import { StudentProfileDialog } from '@/components/StudentProfileDialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { departments, Student, getRegisteredStudents } from '@/data/sampleData';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);

  // Load students from Supabase on mount
  useEffect(() => {
    const loadStudents = async () => {
      const data = await getRegisteredStudents();
      setStudents(data);
    };
    loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'All Departments' || 
        student.department === selectedDepartment;
      const matchesYear = true;
      
      return matchesSearch && matchesDepartment && matchesYear;
    });
  }, [searchTerm, selectedDepartment, students]);

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsProfileOpen(true);
  };

  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4 animate-fade-in-up">
            Student Directory
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Connect with fellow alumni from all departments and graduation years
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Student Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {filteredStudents.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6 animate-fade-in">
                Showing {filteredStudents.length} of {students.length} members
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStudents.map((student, index) => (
                  <div
                    key={student.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-fade-in-up"
                  >
                    <StudentCard 
                      student={student} 
                      onClick={() => handleStudentClick(student)}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <p className="text-muted-foreground text-lg mb-2">
                {students.length === 0 
                  ? 'No registered students yet.' 
                  : 'No students found matching your criteria.'}
              </p>
              {students.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Students will appear here once they register.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Student Profile Dialog */}
      <StudentProfileDialog
        student={selectedStudent}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />
    </Layout>
  );
};

export default Students;
