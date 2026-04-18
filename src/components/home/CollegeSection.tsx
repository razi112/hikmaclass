import { AnimateIn } from '@/components/AnimateIn';
import { MapPin, BookOpen, Users, X, Calendar, Image as ImageIcon, Play } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

const VIDEO_ID = 'JCGVD70akss';
const THUMB = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

const VideoCard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      {/* ── thumbnail card ── */}
      <div
        className="relative rounded-3xl overflow-hidden border border-white/10 cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setModalOpen(true)}
      >
        <div className="relative w-full overflow-hidden rounded-2xl m-3"
          style={{ width: 'calc(100% - 24px)' }}>
          <img
            src={THUMB}
            alt="Akode Islamic Centre Promo"
            className="w-full object-cover rounded-xl"
            style={{ aspectRatio: '16/9' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 rounded-xl bg-black/20
            group-hover:bg-black/10 transition-colors duration-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30
                flex items-center justify-center transition-all duration-500"
              style={{
                transform: hovered ? 'scale(1.15)' : 'scale(1)',
                boxShadow: hovered ? '0 0 40px rgba(255,255,255,0.3)' : '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 pt-1 flex items-end justify-between">
          <div>
            <p className="font-bold text-foreground text-lg">Islamic Dawa Academy</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Where tradition meets technology. Empowering the next generation of Islamic leaders.
            </p>
          </div>
          <span className="text-cyan-500 text-sm font-semibold shrink-0 ml-4">Est. 2019</span>
        </div>
      </div>

      {/* ── video modal via portal ── */}
      {modalOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative bg-background rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl"
            style={{ animation: 'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* modal header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-border/40">
              <div>
                <h3 className="font-bold text-foreground text-base">Islamic Da'wa Academy Introduction</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Learn more about our academy</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground
                  hover:text-foreground hover:bg-muted transition-colors ml-4 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* iframe */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                title="Islamic Da'wa Academy Akode - Promo Video - Akode Islamic Centre"
                frameBorder="0"
                allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {/* modal footer */}
            <div className="flex items-center justify-between px-5 py-3 bg-muted/40 border-t border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-teal-500
                  flex items-center justify-center shadow">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Islamic Da'wa Academy</p>
                  <p className="text-xs text-muted-foreground">Excellence in Islamic Education</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500
                  text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Close Video
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </>
  );
};

const stats = [
  { icon: Users,    value: '300+',   label: 'Students Enrolled' },
  { icon: BookOpen, value: '40+',    label: 'Academic Programs' },
  { icon: MapPin,   value: 'Kerala', label: 'Location' },
];

const collegeImage = {
  src: 'https://dawaacademy.in/images/dawa-academy.webp',
  title: 'Akode Islamic Centre Campus',
  description: 'A view of our prestigious Post-Hifz residential campus in Akode.',
  date: '15/08/2024',
  tags: ['#campus', '#exterior', '#architecture', '#academy'],
};

export const CollegeSection = () => {
  const [lightbox, setLightbox] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    setSpot({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">

        <AnimateIn direction="up" className="text-center mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest
            text-cyan-500 mb-3 px-3 py-1 rounded-full bg-cyan-500/10">
            Our Institution
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Akode Islamic Centre
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            One of India's premier Islamic institutions, blending classical Islamic sciences with modern academics
            to nurture scholars, thinkers, and leaders for the contemporary world.
          </p>
        </AnimateIn>

        <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">

          {/* ── image card with spotlight hover ── */}
          <AnimateIn direction="left">
            <div
              ref={cardRef}
              className="relative rounded-3xl overflow-hidden cursor-pointer"
              style={{
                transform: hovered ? 'scale(1.02) translateY(-4px)' : 'scale(1) translateY(0)',
                transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease',
                boxShadow: hovered
                  ? '0 20px 60px rgba(6,182,212,0.35), 0 8px 24px rgba(0,0,0,0.2)'
                  : '0 4px 20px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onMouseMove={onMove}
              onClick={() => setLightbox(true)}
            >
              {/* gradient border glow */}
              <div
                className="absolute inset-0 rounded-3xl -z-10 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #1e3a5f, #0891b2)',
                  opacity: hovered ? 1 : 0,
                  padding: '2px',
                  filter: 'blur(1px)',
                }}
              />

              <div className="relative w-full h-72 bg-gradient-to-br from-[#1a8fa8] via-[#1e3a5f] to-[#0f2340]">
                <img
                  src={collegeImage.src}
                  alt="Islamic Centre"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
                  style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />

                {/* spotlight radial follow */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                  style={{
                    opacity: hovered ? 1 : 0,
                    background: `radial-gradient(circle 160px at ${spot.x}% ${spot.y}%, rgba(255,255,255,0.12) 0%, transparent 65%)`,
                  }}
                />

                {/* bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-20
                  bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* location badge */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5
                rounded-full bg-black/50 backdrop-blur-sm border border-white/10
                transition-all duration-500"
                style={{ transform: hovered ? 'translateY(-2px)' : 'translateY(0)' }}>
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs text-white font-medium">Akode, Kerala, India</span>
              </div>

              {/* click hint */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none
                  transition-opacity duration-500"
                style={{ opacity: hovered ? 1 : 0 }}
              >
                <span className="bg-black/55 text-white text-xs font-medium px-3 py-1.5
                  rounded-full backdrop-blur-sm border border-white/10">
                  Click to expand
                </span>
              </div>
            </div>
          </AnimateIn>

          {/* ── right info ── */}
          <AnimateIn direction="right">
            <div className="space-y-6">
              <p className="text-foreground/80 leading-relaxed">
                Founded with a vision to produce well-rounded graduates, Akode Islamic Centre integrates the depth of
                traditional Islamic scholarship with the breadth of contemporary education — producing alumni
                who serve communities across the globe.
              </p>

              {/* stat cards */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s) => (
                  <div key={s.label}
                    className="relative flex items-start gap-3 p-4 rounded-xl bg-muted/60 border border-border/50
                      overflow-hidden group transition-all duration-500
                      hover:border-cyan-500/50 hover:bg-cyan-500/5
                      hover:shadow-[0_4px_24px_rgba(6,182,212,0.2)]
                      hover:-translate-y-1">
                    {/* shimmer on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                      pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/8 to-transparent
                        animate-[shimmerSweep_1.8s_ease-in-out_infinite]" />
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0
                      group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-500">
                      <s.icon className="w-4 h-4 text-cyan-500" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-lg leading-none">{s.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://dawaacademy.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-500
                  hover:text-cyan-400 transition-colors duration-500 group"
              >
                Visit Official Website
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </AnimateIn>
        </div>

        {/* ── YouTube Video ── */}
        <div className="max-w-5xl mx-auto mt-14">
          <div className="text-center mb-6">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest
              text-cyan-500 mb-2 px-3 py-1 rounded-full bg-cyan-500/10">
              Campus Video
            </span>
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Akode Islamic Centre — Promo
            </h3>
          </div>

          <VideoCard />
        </div>

      </div>

      {/* ── Lightbox ── */}
      {lightbox && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
        >
          <div
            className="relative bg-background rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full"
            style={{ animation: 'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm
                flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <img
              src={collegeImage.src}
              alt={collegeImage.title}
              className="w-full max-h-[60vh] object-cover"
            />

            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1
                  rounded-full bg-blue-500 text-white">
                  <ImageIcon className="w-3 h-3" /> Photo
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-border text-muted-foreground">
                  Campus Life
                </span>
              </div>
              <h3 className="font-bold text-foreground text-xl mb-1">{collegeImage.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{collegeImage.description}</p>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  {collegeImage.date}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {collegeImage.tags.map((tag) => (
                    <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      , document.body)}
    </section>
  );
};
