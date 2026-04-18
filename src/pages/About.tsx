import { Layout } from '@/components/layout/Layout';
import { AboutSection } from '@/components/home/AboutSection';
import { CollegeSection } from '@/components/home/CollegeSection';
import { Quote, GraduationCap, Star, Globe, Mail, Phone } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';

const classTeacher = {
  name: 'Hafiz Ahmed Dilqash Furqani',
  title: 'Class Teacher · Hikma Class 2026',
  photo: '/images/usthad%20(1).jpg',
  photo2: '/images/usthad%20(2).jpg',
  fallback: 'https://ui-avatars.com/api/?name=Ahmed+Dilqash+Furqani&background=1e3a5f&color=fff&size=300&bold=true',
  quote: "It has been a privilege to guide this remarkable class. Each student carries the spirit of Hikma — curiosity, integrity, and the drive to make a difference. I am proud of every one of you.",
};

const About = () => {
  const [hovered, setHovered] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const [tcHovered, setTcHovered] = useState(false);
  const [tcSpot, setTcSpot] = useState({ x: 50, y: 50 });
  const tcRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpotlight({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  }, []);

  const handleTcMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = tcRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTcSpot({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  }, []);

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
              Class Usthad
            </h2>
            <p className="text-muted-foreground">The guiding light of Hikma Class 2026</p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* rotating gradient border wrapper */}
            <div className={`relative rounded-3xl p-[2px] transition-all duration-500
              ${hovered ? 'shadow-[0_0_70px_rgba(139,92,246,0.4)]' : 'shadow-[0_8px_40px_rgba(0,0,0,0.12)]'}`}>

              {/* animated conic border — only visible on hover */}
              <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500
                ${hovered ? 'opacity-100' : 'opacity-0'}`}
                style={{ background: 'conic-gradient(from var(--angle), #7c3aed, #06b6d4, #a855f7, #7c3aed)',
                  animation: hovered ? 'rotateBorder 3s linear infinite' : 'none' }} />

              <div
                ref={cardRef}
                className="relative rounded-3xl overflow-hidden bg-card cursor-default"
                style={{
                  transform: hovered ? 'scale(1.012)' : 'scale(1)',
                  transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onMouseMove={handleMouseMove}
              >
                {/* spotlight radial follow */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-3xl"
                  style={{
                    opacity: hovered ? 1 : 0,
                    background: `radial-gradient(circle 280px at ${spotlight.x}% ${spotlight.y}%, rgba(139,92,246,0.12) 0%, transparent 70%)`,
                  }}
                />

                {/* top gradient bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500" />

                <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                  <div className="relative shrink-0">
                    <div className={`w-36 h-36 rounded-2xl p-[3px] bg-gradient-to-br from-violet-500 to-cyan-500
                      transition-all duration-500
                      ${hovered ? 'shadow-[0_0_52px_rgba(139,92,246,0.65)] rotate-1' : 'shadow-[0_0_32px_rgba(139,92,246,0.35)] rotate-0'}`}>
                      <img src={classTeacher.photo} alt={classTeacher.name}
                        className="w-full h-full rounded-xl object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = classTeacher.fallback; }} />
                    </div>
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-500/20
                      blur-xl -z-10 scale-110 transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-50'}`} />

                    {/* floating badge */}
                    <div className={`absolute -top-3 -right-3 px-2.5 py-1 rounded-full text-xs font-semibold
                      bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg
                      transition-all duration-500 ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                      ✦ Mentor
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <Quote className={`w-8 h-8 mb-3 mx-auto md:mx-0 transition-all duration-500
                      ${hovered ? 'text-violet-400 scale-110' : 'text-violet-400/50 scale-100'}`} />
                    <p className="text-foreground/90 text-lg leading-relaxed font-serif italic mb-6">
                      "{classTeacher.quote}"
                    </p>
                    <div className={`h-px w-16 mb-4 mx-auto md:mx-0 bg-gradient-to-r from-violet-500 to-cyan-400
                      transition-all duration-500 ${hovered ? 'w-32 opacity-100' : 'w-8 opacity-40'}`} />
                    <p className="font-bold text-foreground text-xl font-serif">{classTeacher.name}</p>
                    <p className={`text-sm font-medium mt-0.5 transition-colors duration-500
                      ${hovered ? 'text-cyan-500' : 'text-violet-500'}`}>{classTeacher.title}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Class Teacher Section ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              About Class Teacher
            </h2>
            <p className="text-muted-foreground">Professional background and expertise</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div
              ref={tcRef}
              className="relative rounded-3xl overflow-hidden bg-card border transition-all duration-500"
              style={{
                borderColor: tcHovered ? 'rgba(20,184,166,0.6)' : 'hsl(var(--border) / 0.6)',
                boxShadow: tcHovered
                  ? '0 20px 50px rgba(0,0,0,0.15)'
                  : '0 4px 20px rgba(0,0,0,0.08)',
                transform: tcHovered ? 'translateY(-8px) scale(1.015)' : 'translateY(0) scale(1)',
                transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease, border-color 0.5s ease',
              }}
              onMouseEnter={() => setTcHovered(true)}
              onMouseLeave={() => setTcHovered(false)}
            >
              {/* shimmer sweep on hover */}
              <div className={`absolute inset-0 pointer-events-none z-10 transition-opacity duration-500
                ${tcHovered ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
                  animate-[shimmerSweep_2s_ease-in-out_infinite]" />
              </div>

              {/* dark header band */}
              <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-lg">Hafiz Dilqash Ahammed Furqani</h3>
                    <p className="text-teal-100 text-sm font-medium">Assistant Professor of Quran</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-teal-100">
                    <GraduationCap className="w-4 h-4" />
                    <span>Hafiz & Master's</span>
                  </div>
                </div>
              </div>

              {/* two-column body */}
              <div className="grid md:grid-cols-[200px_1fr] gap-6 p-6">

                {/* left — avatar + badges */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600
                      flex items-center justify-center shadow-xl overflow-hidden"
                      style={{
                        transform: tcHovered ? 'scale(1.05) rotate(-1deg)' : 'scale(1) rotate(0deg)',
                        boxShadow: tcHovered ? '0 0 40px rgba(20,184,166,0.4)' : '',
                        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease',
                      }}>
                      <img
                        src={classTeacher.photo2}
                        alt={classTeacher.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src = classTeacher.fallback;
                        }}
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full text-xs font-bold
                      bg-amber-500 text-white shadow-lg">
                      📖 Academic
                    </div>
                  </div>

                  {/* contact buttons */}
                  <div className="flex flex-col gap-2 w-full">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                      bg-teal-500/10 border border-teal-500/30 text-teal-600 text-sm font-medium
                      hover:bg-teal-500 hover:text-white transition-all duration-500">
                      <Mail className="w-4 h-4" /> Email
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                      bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 text-sm font-medium
                      hover:bg-cyan-500 hover:text-white transition-all duration-500">
                      <Phone className="w-4 h-4" /> Call
                    </button>
                  </div>
                </div>

                {/* right — details */}
                <div className="space-y-4">
                  {/* bio */}
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Hafiz Dilqash Ahammed Furqani is an expert in Quranic memorization and recitation.
                    His expertise in Tajweed and Quranic studies makes him an invaluable member of the Quran department.
                  </p>

                  {/* grid of info cards */}
                  <div className="grid gap-3">
                    {/* education */}
                    <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/20
                      hover:bg-teal-500/10 hover:border-teal-500/30 transition-all duration-500 group">
                      <h4 className="flex items-center gap-2 font-bold text-foreground text-sm mb-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-500/15 flex items-center justify-center
                          group-hover:bg-teal-500/25 transition-colors duration-500">
                          <GraduationCap className="w-4 h-4 text-teal-600" />
                        </div>
                        Education
                      </h4>
                      <ul className="space-y-1 ml-9">
                        {['Hafiz Quran', 'Graduate from Renowned Quranic institute, Kerala'].map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-foreground/75">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* specialization */}
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20
                      hover:bg-amber-500/10 hover:border-amber-500/30 transition-all duration-500 group">
                      <h4 className="flex items-center gap-2 font-bold text-foreground text-sm mb-1">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center
                          group-hover:bg-amber-500/25 transition-colors duration-500">
                          <Star className="w-4 h-4 text-amber-600" />
                        </div>
                        Specialization
                      </h4>
                      <p className="text-sm text-foreground/75 ml-9">Quranic Memorization, Tajweed Sciences</p>
                    </div>

                    {/* languages */}
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20
                      hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-500 group">
                      <h4 className="flex items-center gap-2 font-bold text-foreground text-sm mb-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center
                          group-hover:bg-blue-500/25 transition-colors duration-500">
                          <Globe className="w-4 h-4 text-blue-600" />
                        </div>
                        Languages
                      </h4>
                      <div className="flex flex-wrap gap-2 ml-9">
                        {['Arabic', 'English', 'Urdu'].map((lang) => (
                          <span key={lang}
                            className="px-2.5 py-1 rounded-md text-xs font-medium
                              bg-blue-500/10 text-blue-700 border border-blue-500/20">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />
      <CollegeSection />
    </Layout>
  );
};

export default About;
