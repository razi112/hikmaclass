import { GraduationCap, BookOpen, Settings, UserCheck, CalendarDays, Bell, ClipboardList, Users, BarChart3, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const roles = [
  {
    icon: GraduationCap,
    title: 'Students',
    emoji: '🎓',
    features: [
      { icon: UserCheck, label: 'Register & Login' },
      { icon: ClipboardList, label: 'View Attendance' },
      { icon: CalendarDays, label: 'Join Events' },
      { icon: Bell, label: 'Receive Announcements' },
    ],
  },
  {
    icon: BookOpen,
    title: 'Teachers',
    emoji: '👨‍🏫',
    features: [
      { icon: ClipboardList, label: 'Mark Attendance' },
      { icon: Bell, label: 'Post Announcements' },
      { icon: Users, label: 'View Student Data' },
    ],
  },
  {
    icon: Settings,
    title: 'Admin',
    emoji: '🛠',
    features: [
      { icon: Users, label: 'Manage Users' },
      { icon: CalendarDays, label: 'Manage Events' },
      { icon: BarChart3, label: 'View Reports & Analytics' },
      { icon: Shield, label: 'System Control' },
    ],
  },
];

export const RolesSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Platform Roles & Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform serves students, teachers, and administrators with tailored features for each role.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {roles.map((role, index) => (
            <Card
              key={role.title}
              className="group overflow-hidden hover:shadow-elevated transition-all duration-300 border-2 border-transparent hover:border-secondary/40 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <span className="text-4xl mb-3 block">{role.emoji}</span>
                  <h3 className="font-serif text-2xl font-bold text-foreground">
                    {role.title}
                  </h3>
                </div>

                <ul className="space-y-3">
                  {role.features.map((feature) => (
                    <li
                      key={feature.label}
                      className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <feature.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">{feature.label}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
