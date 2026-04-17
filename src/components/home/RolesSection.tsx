import {
  GraduationCap, BookOpen, Settings,
  UserCheck, CalendarDays, Bell, ClipboardList,
  Users, BarChart3, Shield,
} from 'lucide-react';
import { useState, useRef, useCallback } from 'react';

const roles = [
  {
    icon: GraduationCap,
    title: 'Students',
    emoji: '🎓',
    gradient: 'from-violet-500 via-purple-500 to-indigo-600',
    shine: 'rgba(139,92,246,0.25)',
    glow: '139,92,246',
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/15',
    tag: 'Student Portal',
    features: [
      { icon: UserCheck,     label: 'Register & Login' },
      { icon: ClipboardList, label: 'View Attendance' },
      { icon: CalendarDays,  label: 'Join Events' },
      { icon: Bell,          label: 'Receive Announcements' },
    ],
  },
  {
    icon: BookOpen,
    title: 'Class Teacher',
    emoji: '👨‍🏫',
    gradient: 'from-cyan-400 via-teal-500 to-emerald-500',
    shine: 'rgba(6,182,212,0.25)',
    glow: '6,182,212',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/15',
    tag: 'Educator',
    features: [
      { icon: ClipboardList, label: 'Hafiz Ahmed Dilqash Furqani' },
      { icon: Bell,          label: 'Hifz Completer' },
    ],
  },
  {
    icon: Settings,
    title: 'Admin',
    emoji: '🛠',
    gradient: 'from-rose-500 via-pink-500 to-orange-500',
    shine: 'rgba(244,63,94,0.25)',
    glow: '244,63,94',
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/15',
    tag: 'Control Panel',
    features: [
      { icon: Users,        label: 'Manage Users' },
      { icon: CalendarDays, label: 'Manage Events' },
      { icon: BarChart3,    label: 'View Reports & Analytics' },
      { icon: Shield,       label: 'System Control' },
    ],
  },
];

type Role = typeof roles[0];

const RoleCard = ({ role, index }: { role: Role; index: number }) => {
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = (e.clientX - r.left) / r.width;   // 0–1
    const cy = (e.clientY - r.top)  / r.height;  // 0–1
    setShine({ x: cx * 100, y: cy * 100 });
  }, []);

  const onLeave = useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <div
      ref={ref}
      className="relative rounded-2xl cursor-default select-none"
      style={{
        animationDelay: `${index * 0.12}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
    >
      {/* outer glow */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-500 blur-xl -z-10"
        style={{
          background: `radial-gradient(ellipse at center, rgba(${role.glow},0.5), transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transform: 'scale(1.1)',
        }}
      />

      {/* card wrapper */}
      <div
        className="relative rounded-2xl overflow-hidden bg-card border border-border/60"
        style={{
          transform: 'none',
          transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
          boxShadow: hovered
            ? `0 24px 60px rgba(${role.glow},0.35), 0 8px 24px rgba(0,0,0,0.2)`
            : '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        {/* holographic shine layer */}
        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(circle 180px at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.12) 0%, transparent 60%),
                         linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)`,
          }}
        />

        {/* gradient top bar */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${role.gradient}`} />

        <div className="p-7">
          {/* tag pill */}
          <div className="flex justify-end mb-4">
            <span className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full
              bg-gradient-to-r ${role.gradient} text-white opacity-80`}>
              {role.tag}
            </span>
          </div>

          {/* icon + title */}
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3
                transition-all duration-400 ${hovered ? role.iconBg : 'bg-primary/10'}`}
              style={{
                transform: hovered ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.3s ease',
              }}
            >
              <role.icon className={`w-8 h-8 transition-colors duration-300
                ${hovered ? role.iconColor : 'text-primary'}`} />
            </div>
            <div className="text-3xl mb-1">{role.emoji}</div>
            <h3 className="font-serif text-2xl font-bold text-foreground">{role.title}</h3>
          </div>

          {/* animated divider */}
          <div
            className={`h-px mb-5 bg-gradient-to-r ${role.gradient} transition-all duration-500 mx-auto`}
            style={{ width: hovered ? '100%' : '2rem', opacity: hovered ? 0.6 : 0.2 }}
          />

          {/* features */}
          <ul className="space-y-2.5">
            {role.features.map((f, i) => (
              <li
                key={f.label}
                className="flex items-center gap-3 text-sm rounded-lg px-2 py-1.5 transition-all duration-300"
                style={{
                  background: hovered ? `rgba(${role.glow},0.06)` : 'transparent',
                  transform: hovered ? 'translateX(4px)' : 'translateX(0)',
                  transition: `all 0.3s ease ${i * 60}ms`,
                  color: hovered ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                }}
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0
                  transition-all duration-300 ${hovered ? role.iconBg : 'bg-primary/10'}`}>
                  <f.icon className={`w-3.5 h-3.5 transition-colors duration-300
                    ${hovered ? role.iconColor : 'text-primary'}`} />
                </div>
                <span className="font-medium">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const RolesSection = () => (
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
        {roles.map((role, i) => (
          <RoleCard key={role.title} role={role} index={i} />
        ))}
      </div>
    </div>
  </section>
);
