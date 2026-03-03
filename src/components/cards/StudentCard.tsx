import { Student } from '@/data/sampleData';
import { Mail, Phone, Linkedin, Twitter, Facebook } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StudentCardProps {
  student: Student;
  onClick?: () => void;
}

export const StudentCard = ({ student, onClick }: StudentCardProps) => {
  return (
    <Card 
      className="group overflow-hidden hover:shadow-elevated transition-all duration-500 animate-scale-in hover:-translate-y-2 hover:scale-[1.02] cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={student.photo}
            alt={student.name}
            className="w-full h-48 object-cover group-hover:scale-110 group-hover:brightness-110 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <p className="text-sm font-medium">View Profile</p>
            </div>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
            {student.name}
          </h3>
          <p className="text-sm text-secondary font-medium mb-1 group-hover:scale-105 inline-block transition-transform duration-300">
            {student.department}
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            {student.classYear}
          </p>
          
          {student.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 group-hover:text-foreground transition-colors duration-300">
              {student.bio}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <a
                href={`mailto:${student.email}`}
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-lg hover:bg-muted transition-all duration-300 hover:scale-110 hover:rotate-6"
                title="Email"
              >
                <Mail className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              {student.phone && (
                <a
                  href={`tel:${student.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-lg hover:bg-muted transition-all duration-300 hover:scale-110 hover:rotate-6"
                  title="Phone"
                >
                  <Phone className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                </a>
              )}
            </div>
            
            {student.socialLinks && (
              <div className="flex items-center gap-1">
                {student.socialLinks.linkedin && (
                  <a
                    href={student.socialLinks.linkedin}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg hover:bg-muted transition-all duration-300 hover:scale-110 hover:-rotate-6"
                  >
                    <Linkedin className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                )}
                {student.socialLinks.twitter && (
                  <a
                    href={student.socialLinks.twitter}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg hover:bg-muted transition-all duration-300 hover:scale-110 hover:-rotate-6"
                  >
                    <Twitter className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                )}
                {student.socialLinks.facebook && (
                  <a
                    href={student.socialLinks.facebook}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg hover:bg-muted transition-all duration-300 hover:scale-110 hover:-rotate-6"
                  >
                    <Facebook className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
