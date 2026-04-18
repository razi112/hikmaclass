import { Student } from '@/data/sampleData';
import { Mail, Phone, Linkedin, Twitter, Facebook, Star } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  onClick?: () => void;
}

const roleGradient: Record<string, string> = {
  'Secretary':         'from-cyan-500 to-teal-500',
  'President':         'from-violet-500 to-purple-600',
  'Vice President':    'from-blue-500 to-indigo-600',
  'Treasurer':         'from-amber-500 to-orange-500',
  'Joint Secretary':   'from-pink-500 to-rose-600',
  'Working Secretary': 'from-emerald-500 to-green-600',
};

export const StudentCard = ({ student, onClick }: StudentCardProps) => {
  const grad = student.role ? (roleGradient[student.role] ?? 'from-violet-500 to-purple-600') : null;

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-500 hover:-translate-y-2"
      onClick={onClick}
    >
      {/* gradient border glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/0 to-purple-600/0
        group-hover:from-violet-500/60 group-hover:to-purple-600/40
        transition-all duration-500 blur-sm scale-105 pointer-events-none" />

      {/* card body */}
      <div className="relative rounded-2xl overflow-hidden bg-card border border-border
        group-hover:border-violet-500/40 transition-colors duration-500
        group-hover:shadow-[0_8px_40px_rgba(139,92,246,0.25)]">

        {/* shimmer sweep */}
        <div className="absolute inset-0 z-10 -translate-x-full group-hover:translate-x-full
          bg-gradient-to-r from-transparent via-white/5 to-transparent
          transition-transform duration-700 ease-in-out pointer-events-none" />

        {/* photo */}
        <div className="relative overflow-hidden h-48">
          <img
            src={student.photo}
            alt={student.name}
            className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-110
              transition-all duration-700 ease-out"
          />
          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent
            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 flex items-end justify-center pb-4
            opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <span className="text-white text-sm font-semibold tracking-wide px-4 py-1.5
              rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
              View Profile
            </span>
          </div>

          {/* role badge — always visible, top right */}
          {student.role && grad && (
            <div className={`absolute top-3 right-3 z-20`}>
              {/* outer glow */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${grad} blur-md opacity-70 scale-110`} />
              {/* badge */}
              <div className={`relative flex items-center gap-1.5 px-3 py-1 rounded-full
                bg-gradient-to-r ${grad}
                shadow-[0_2px_12px_rgba(0,0,0,0.4)]
                border border-white/30 backdrop-blur-sm`}>
                <Star className="w-2.5 h-2.5 fill-white text-white drop-shadow" />
                <span className="text-[11px] font-extrabold text-white tracking-wide uppercase drop-shadow">
                  {student.role}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* info */}
        <div className="p-5">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-0.5
            group-hover:text-primary transition-colors duration-500">
            {student.name}
          </h3>
          <p className="text-sm text-secondary font-medium mb-1">{student.department}</p>

          {student.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4
              group-hover:text-foreground transition-colors duration-500">
              {student.bio}
            </p>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-1">
              <a href={`mailto:${student.email}`} onClick={e => e.stopPropagation()}
                className="p-2 rounded-lg hover:bg-muted transition-all duration-500 hover:scale-110" title="Email">
                <Mail className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              {student.phone && (
                <a href={`tel:${student.phone}`} onClick={e => e.stopPropagation()}
                  className="p-2 rounded-lg hover:bg-muted transition-all duration-500 hover:scale-110" title="Phone">
                  <Phone className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                </a>
              )}
            </div>
            {student.socialLinks && (
              <div className="flex items-center gap-1">
                {student.socialLinks.linkedin && (
                  <a href={student.socialLinks.linkedin} onClick={e => e.stopPropagation()}
                    className="p-2 rounded-lg hover:bg-muted transition-all duration-500 hover:scale-110">
                    <Linkedin className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                )}
                {student.socialLinks.twitter && (
                  <a href={student.socialLinks.twitter} onClick={e => e.stopPropagation()}
                    className="p-2 rounded-lg hover:bg-muted transition-all duration-500 hover:scale-110">
                    <Twitter className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                )}
                {student.socialLinks.facebook && (
                  <a href={student.socialLinks.facebook} onClick={e => e.stopPropagation()}
                    className="p-2 rounded-lg hover:bg-muted transition-all duration-500 hover:scale-110">
                    <Facebook className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
