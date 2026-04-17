import { Student } from '@/data/sampleData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Mail,
  Phone,
  MapPin,
  User,
  Droplet,
  Hash,
  Calendar,
  Linkedin,
  Twitter,
  Facebook,
  Users,
} from 'lucide-react';

interface StudentProfileDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentProfileDialog({
  student,
  open,
  onOpenChange,
}: StudentProfileDialogProps) {
  if (!student) return null;

  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value?: string;
  }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-300 group">
        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-sm font-medium text-foreground">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Student Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <img
                src={student.photo}
                alt={student.name}
                className="relative w-32 h-32 rounded-full object-cover border-4 border-background shadow-xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2 animate-fade-in-up">
                {student.name}
              </h2>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-3">
                <Badge className="bg-secondary text-secondary-foreground animate-slide-in-left">
                  {student.department}
                </Badge>
                <Badge variant="outline" className="animate-slide-in-right">
                  {student.classYear}
                </Badge>
              </div>
              
              {student.bio && (
                <p className="text-sm text-muted-foreground leading-relaxed animate-fade-in-up">
                  {student.bio}
                </p>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Personal Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow
                icon={Hash}
                label="Admission Number"
                value={student.admissionNumber}
              />
              <InfoRow
                icon={Hash}
                label="Roll Number"
                value={student.rollNumber}
              />
              <InfoRow
                icon={Mail}
                label="Email Address"
                value={student.email}
              />
              <InfoRow
                icon={Phone}
                label="Phone Number"
                value={student.phone}
              />
              <InfoRow
                icon={Droplet}
                label="Blood Group"
                value={student.bloodGroup}
              />
            </div>
          </div>

          <Separator className="my-6" />

          {/* Address & Parent Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Contact Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow
                icon={MapPin}
                label="Address"
                value={student.address}
              />
              <InfoRow
                icon={Users}
                label="Parent/Guardian Name"
                value={student.parentName}
              />
            </div>
          </div>

          {/* Social Links */}
          {student.socialLinks && (
            <>
              <Separator className="my-6" />
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Social Media
                </h3>
                
                <div className="flex flex-wrap gap-3">
                  {student.socialLinks.linkedin && (
                    <a
                      href={student.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="text-sm font-medium">LinkedIn</span>
                    </a>
                  )}
                  {student.socialLinks.twitter && (
                    <a
                      href={student.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                    >
                      <Twitter className="w-4 h-4" />
                      <span className="text-sm font-medium">Twitter</span>
                    </a>
                  )}
                  {student.socialLinks.facebook && (
                    <a
                      href={student.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/10 text-blue-700 hover:bg-blue-600/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                    >
                      <Facebook className="w-4 h-4" />
                      <span className="text-sm font-medium">Facebook</span>
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
