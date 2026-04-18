import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, Award, BookOpen, Mic, Globe, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimateIn } from '@/components/AnimateIn';
import { TypingAnimation } from '@/components/TypingAnimation';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">

            {/* Floating icon cluster */}
            <AnimateIn direction="up" delay={200}>
              <div className="relative flex items-center justify-center h-36 -mt-10 mb-4 select-none">
                {/* Top-left: Book */}
                <div className="absolute" style={{ top: '0px', left: 'calc(50% - 110px)' }}>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '0s' }}>
                    <BookOpen className="w-5 h-5 text-white/80" />
                  </div>
                </div>
                {/* Top-right: Mic */}
                <div className="absolute" style={{ top: '0px', left: 'calc(50% + 50px)' }}>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '0.8s' }}>
                    <Mic className="w-5 h-5 text-white/80" />
                  </div>
                </div>
                {/* Center: Turban / Islamic crescent */}
                <div className="absolute" style={{ top: '18px', left: 'calc(50% - 32px)' }}>
                  <div className="w-16 h-16 rounded-2xl bg-[#3a3a1a]/80 backdrop-blur border border-yellow-700/40 flex items-center justify-center shadow-xl animate-float" style={{ animationDelay: '0.4s' }}>
                    <span className="text-3xl leading-none">🕌</span>
                  </div>
                </div>
                {/* Middle-left: Globe */}
                <div className="absolute" style={{ top: '44px', left: 'calc(50% - 170px)' }}>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '1.2s' }}>
                    <Globe className="w-5 h-5 text-white/80" />
                  </div>
                </div>
                {/* Middle-right: Fingerprint */}
                <div className="absolute" style={{ top: '44px', left: 'calc(50% + 110px)' }}>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '1.6s' }}>
                    <Fingerprint className="w-5 h-5 text-white/80" />
                  </div>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn direction="down" delay={300}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary mb-6">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">Excellence Through Unity</span>
              </div>
            </AnimateIn>

            <div className="mb-6">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight min-h-[1.2em]">
                <TypingAnimation 
                  text="Welcome to Hikma Class Union" 
                  speed={80}
                  delay={500}
                />
              </h1>
            </div>
            
            <AnimateIn direction="up" delay={3500}>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Connecting generations of alumni, fostering lifelong bonds, and building a community dedicated to excellence and mutual support.
              </p>
            </AnimateIn>
            
            <AnimateIn direction="up" delay={3700}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/students">
                  <Button size="lg" className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 transition-transform duration-500 hover:scale-105 active:scale-95">
                    Explore Members
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/events">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 transition-transform duration-500 hover:scale-105 active:scale-95">
                    Upcoming Events
                  </Button>
                </Link>
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>
    </section>
  );
};
