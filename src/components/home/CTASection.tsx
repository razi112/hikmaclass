import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimateIn } from '@/components/AnimateIn';

export const CTASection = () => {
  return (
    <section className="py-20 hero-gradient relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateIn direction="scale" delay={100}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Join Our Community</span>
            </div>
          </AnimateIn>
          
          <AnimateIn direction="blur" delay={200}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Reconnect with Your Classmates?
            </h2>
          </AnimateIn>
          
          <AnimateIn direction="up" delay={350}>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Whether you're looking to network, find mentorship, or simply reconnect with old friends, Hikma Class Union is here for you.
            </p>
          </AnimateIn>
          
          <AnimateIn direction="up" delay={500}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 transition-transform duration-500 hover:scale-105 active:scale-95">
                  Get In Touch
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/students">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 transition-transform duration-500 hover:scale-105 active:scale-95">
                  Browse Members
                </Button>
              </Link>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
};
