import { Target, Heart, Lightbulb, Handshake } from 'lucide-react';
import { AnimateIn } from '@/components/AnimateIn';
import { useState } from 'react';

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To foster a strong, supportive network of alumni dedicated to personal and professional growth.',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.4)',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
  },
  {
    icon: Heart,
    title: 'Community',
    description: 'Building lasting relationships that transcend graduation and geographical boundaries.',
    gradient: 'from-rose-500 to-pink-600',
    glow: 'rgba(244,63,94,0.4)',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-500',
  },
  {
    icon: Lightbulb,
    title: 'Excellence',
    description: 'Inspiring members to achieve greatness and contribute meaningfully to society.',
    gradient: 'from-amber-400 to-orange-500',
    glow: 'rgba(251,191,36,0.4)',
    iconBg: 'bg-amber-400/10',
    iconColor: 'text-amber-500',
  },
  {
    icon: Handshake,
    title: 'Support',
    description: 'Providing mentorship, resources, and opportunities for continuous development.',
    gradient: 'from-cyan-500 to-teal-500',
    glow: 'rgba(6,182,212,0.4)',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-500',
  },
];

const ValueCard = ({ value, index }: { value: typeof values[0]; index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <AnimateIn direction="up" delay={index * 120}>
      <div
        className="relative h-full rounded-2xl p-[2px] transition-all duration-500 cursor-default"
        style={{
          background: hovered
            ? `linear-gradient(135deg, var(--tw-gradient-stops))`
            : 'transparent',
          boxShadow: hovered ? `0 8px 40px ${value.glow}` : '0 2px 12px rgba(0,0,0,0.08)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* gradient border wrapper */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${value.gradient}
          transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* card body */}
        <div className={`relative rounded-2xl bg-card p-6 h-full overflow-hidden
          transition-transform duration-500 ${hovered ? 'scale-[0.995]' : 'scale-100'}`}>

          {/* shimmer sweep */}
          <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500
            ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/6 to-transparent
              animate-[shimmerSweep_1.6s_ease-in-out_infinite]" />
          </div>

          {/* subtle top accent line */}
          <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${value.gradient}
            transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`} />

          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4
            transition-all duration-500
            ${hovered ? `${value.iconBg} scale-110` : 'bg-primary/10 scale-100'}`}>
            <value.icon className={`w-7 h-7 transition-colors duration-500
              ${hovered ? value.iconColor : 'text-primary'}`} />
          </div>

          <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
            {value.title}
          </h3>
          <p className={`text-sm leading-relaxed transition-colors duration-500
            ${hovered ? 'text-foreground/80' : 'text-muted-foreground'}`}>
            {value.description}
          </p>
        </div>
      </div>
    </AnimateIn>
  );
};

export const AboutSection = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <AnimateIn direction="up" className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            About Hikma Class Union
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Founded on the principles of unity and excellence, we bring together alumni from all walks of life to create a thriving community.
          </p>
        </AnimateIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <ValueCard key={index} value={value} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
