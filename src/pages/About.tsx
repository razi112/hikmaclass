import { Layout } from '@/components/layout/Layout';
import { AboutSection } from '@/components/home/AboutSection';
import { Quote } from 'lucide-react';

const classTeacher = {
  name: 'Ahmed Dilqash Furqani',
  title: 'Class Teacher · Hikma Class 2026',
  photo: 'https://ui-avatars.com/api/?name=Ahmed+Dilqash+Furqani&background=1e3a5f&color=fff&size=300&bold=true',
  quote: "It has been a privilege to guide this remarkable class. Each student carries the spirit of Hikma — curiosity, integrity, and the drive to make a difference. I am proud of every one of you.",
};

const About = () => {
  return (
    <Layout>
      <section className="hero-gradient py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            About Us
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Learn about our mission, values, and the community we've built together
          </p>
        </div>
      </section>

      {/* Class Teacher — above About section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Class Teacher
            </h2>
            <p className="text-muted-foreground">The guiding light of Hikma Class 2026</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-card border border-border
              shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
              <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500" />
              <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                <div className="relative shrink-0">
                  <div className="w-36 h-36 rounded-2xl p-[3px] bg-gradient-to-br from-violet-500 to-cyan-500
                    shadow-[0_0_32px_rgba(139,92,246,0.35)]">
                    <img src={classTeacher.photo} alt={classTeacher.name}
                      className="w-full h-full rounded-xl object-cover" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-500/20
                    blur-xl -z-10 scale-110" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <Quote className="w-8 h-8 text-violet-400/60 mb-3 mx-auto md:mx-0" />
                  <p className="text-foreground/90 text-lg leading-relaxed font-serif italic mb-6">
                    "{classTeacher.quote}"
                  </p>
                  <p className="font-bold text-foreground text-xl font-serif">{classTeacher.name}</p>
                  <p className="text-sm text-violet-500 font-medium mt-0.5">{classTeacher.title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />
    </Layout>
  );
};

export default About;
