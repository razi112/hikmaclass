import { Target, Heart, Lightbulb, Handshake } from 'lucide-react';
import { AnimateIn } from '@/components/AnimateIn';

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To foster a strong, supportive network of alumni dedicated to personal and professional growth.',
  },
  {
    icon: Heart,
    title: 'Community',
    description: 'Building lasting relationships that transcend graduation and geographical boundaries.',
  },
  {
    icon: Lightbulb,
    title: 'Excellence',
    description: 'Inspiring members to achieve greatness and contribute meaningfully to society.',
  },
  {
    icon: Handshake,
    title: 'Support',
    description: 'Providing mentorship, resources, and opportunities for continuous development.',
  },
];

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
            <AnimateIn key={index} direction="up" delay={index * 120}>
              <div className="bg-card p-6 rounded-xl shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
};
