import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Sparkles, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Committee', path: '/committee' },
  { name: 'Students', path: '/students' },
  { name: 'Events', path: '/events' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

const wingsLinks = [
  { name: 'English',   path: '/wings/english' },
  { name: 'Media',     path: '/wings/media' },
  { name: 'Malayalam', path: '/wings/malayalam' },
  { name: 'Urdu',      path: '/wings/urdu' },
  { name: 'Magazine',  path: '/wings/magazine' },
  { name: 'Tharbiya',  path: '/wings/tharbiya' },
  { name: 'Arabic',    path: '/wings/arabic' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wingsOpen, setWingsOpen] = useState(false);
  const wingsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); setWingsOpen(false); }, [location.pathname]);

  // close wings dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wingsRef.current && !wingsRef.current.contains(e.target as Node)) setWingsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <nav
          className={cn(
            'w-full max-w-5xl flex items-center justify-between px-4 py-2.5 rounded-2xl transition-all duration-700 ease-in-out',
            scrolled
              ? 'bg-black/80 backdrop-blur-2xl border border-white/10'
              : 'bg-black/60 backdrop-blur-xl border border-white/8'
          )}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center
              shadow-[0_0_16px_rgba(139,92,246,0.5)]
              group-hover:shadow-[0_0_32px_rgba(139,92,246,0.8)]
              group-hover:scale-110 group-hover:rotate-6
              transition-all duration-500 ease-out">
              <GraduationCap className="w-5 h-5 text-white transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-serif text-base text-white tracking-widest uppercase
                transition-all duration-500 group-hover:tracking-[0.25em] group-hover:text-violet-300">Hikma</span>
              <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-sans
                transition-all duration-500 group-hover:text-white/60">Class Union</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'relative px-3.5 py-1.5 text-sm font-medium rounded-xl overflow-hidden',
                  'transition-all duration-300 ease-out',
                  'hover:scale-105 hover:text-white',
                  'before:absolute before:inset-0 before:rounded-xl before:opacity-0',
                  'before:bg-gradient-to-r before:from-violet-600/20 before:to-violet-400/10',
                  'before:transition-all before:duration-300 hover:before:opacity-100',
                  'after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2',
                  'after:h-[2px] after:w-0 after:rounded-full after:bg-violet-400',
                  'after:transition-all after:duration-300 hover:after:w-3/4',
                  location.pathname === link.path
                    ? 'text-white'
                    : 'text-white/45'
                )}
              >
                {location.pathname === link.path && (
                  <span className="absolute inset-0 rounded-xl bg-white/10 border border-white/10
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" />
                )}
                <span className="relative">{link.name}</span>
                {/* active underline */}
                <span className={cn(
                  'absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full',
                  'bg-gradient-to-r from-violet-400 to-cyan-400',
                  'transition-all duration-300',
                  location.pathname === link.path ? 'w-4/5 opacity-100' : 'w-0 opacity-0'
                )} />
              </Link>
            ))}

            {/* Wings dropdown */}
            <div ref={wingsRef} className="relative">
              <button
                onClick={() => setWingsOpen(v => !v)}
                className={cn(
                  'relative flex items-center gap-1 px-3.5 py-1.5 text-sm font-medium rounded-xl',
                  'transition-all duration-300 ease-out hover:scale-105 hover:text-white',
                  'before:absolute before:inset-0 before:rounded-xl before:opacity-0',
                  'before:bg-gradient-to-r before:from-violet-600/20 before:to-violet-400/10',
                  'before:transition-all before:duration-300 hover:before:opacity-100',
                  location.pathname === '/wings' ? 'text-white' : 'text-white/45'
                )}
              >
                {location.pathname === '/wings' && (
                  <span className="absolute inset-0 rounded-xl bg-white/10 border border-white/10" />
                )}
                <span className="relative">Wings</span>
                <ChevronDown className={cn('relative w-3.5 h-3.5 transition-transform duration-300',
                  wingsOpen ? 'rotate-180' : 'rotate-0')} />
                <span className={cn(
                  'absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full',
                  'bg-gradient-to-r from-violet-400 to-cyan-400 transition-all duration-300',
                  location.pathname === '/wings' ? 'w-4/5 opacity-100' : 'w-0 opacity-0'
                )} />
              </button>

              {/* dropdown panel */}
              <div className={cn(
                'absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44',
                'bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden',
                'transition-all duration-300 ease-out',
                wingsOpen
                  ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                  : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
              )}>
                <div className="p-1.5 space-y-0.5">
                  {wingsLinks.map((w, i) => (
                    <Link
                      key={w.path}
                      to={w.path}
                      onClick={() => setWingsOpen(false)}
                      style={{ transitionDelay: wingsOpen ? `${i * 30}ms` : '0ms' }}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium',
                        'text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200',
                        wingsOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                      )}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 shrink-0" />
                      {w.name}
                    </Link>
                  ))}
                  <div className="px-3 pt-1 pb-1.5 border-t border-white/8 mt-1">
                    <Link
                      to="/wings"
                      onClick={() => setWingsOpen(false)}
                      className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      View all wings →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Get Started */}
          <div className="hidden md:flex items-center shrink-0">
            <Link
              to="/login"
              className="group/btn relative flex items-center gap-1.5 px-4 py-1.5 rounded-xl overflow-hidden
                bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-semibold
                shadow-[0_0_20px_rgba(139,92,246,0.35)]
                hover:shadow-[0_0_36px_rgba(139,92,246,0.65)]
                hover:scale-105 active:scale-95
                transition-all duration-300 ease-out"
            >
              {/* shimmer sweep */}
              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full
                bg-gradient-to-r from-transparent via-white/20 to-transparent
                transition-transform duration-700 ease-in-out" />
              <Sparkles className="w-3.5 h-3.5 transition-all duration-300 group-hover/btn:rotate-12 group-hover/btn:scale-110 relative" />
              <span className="relative">Get Started</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl
              text-white/60 hover:text-white hover:bg-white/8
              hover:shadow-[0_0_12px_rgba(139,92,246,0.3)]
              transition-all duration-300 ease-out hover:scale-105 active:scale-95"
          >
            <div className="relative w-4 h-4">
              <Menu className={cn('w-4 h-4 absolute inset-0 transition-all duration-400 ease-in-out',
                isOpen ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100')} />
              <X className={cn('w-4 h-4 absolute inset-0 transition-all duration-400 ease-in-out',
                isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0')} />
            </div>
          </button>
        </nav>

        {/* Mobile dropdown */}
        <div
          className={cn(
            'absolute top-[calc(100%-8px)] left-4 right-4 max-w-5xl mx-auto rounded-2xl',
            'bg-black/90 backdrop-blur-2xl border border-white/10',
            
            'transition-all duration-400 ease-in-out',
            isOpen
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
          )}
        >
          <div className="flex flex-col p-3 gap-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                style={{ transitionDelay: isOpen ? `${i * 40}ms` : '0ms' }}
                className={cn(
                  'px-4 py-2.5 rounded-xl text-sm font-medium',
                  'transition-all duration-300 ease-out',
                  'hover:scale-[1.02] hover:pl-6',
                  isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3',
                  location.pathname === link.path
                    ? 'bg-white/10 text-white border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                    : 'text-white/50 hover:text-white hover:bg-white/6 hover:border hover:border-white/8'
                )}
              >
                {link.name}
              </Link>
            ))}

            {/* Wings section in mobile */}
            <div style={{ transitionDelay: isOpen ? `${navLinks.length * 40}ms` : '0ms' }}
              className={cn('transition-all duration-300', isOpen ? 'opacity-100' : 'opacity-0')}>
              <p className="px-4 pt-1 pb-1 text-[10px] uppercase tracking-widest text-white/30 font-semibold">Wings</p>
              <div className="grid grid-cols-2 gap-1">
                {wingsLinks.map((w) => (
                  <Link key={w.path} to={w.path} onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                      text-white/50 hover:text-white hover:bg-white/8 transition-all duration-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    {w.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className={cn(
              'mt-2 pt-2 border-t border-white/8',
              'transition-all duration-300 ease-out',
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            )}
              style={{ transitionDelay: isOpen ? `${navLinks.length * 40}ms` : '0ms' }}
            >
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="group/mb relative flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl overflow-hidden
                  bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-semibold
                  hover:shadow-[0_0_24px_rgba(139,92,246,0.5)]
                  hover:scale-[1.02] active:scale-95
                  transition-all duration-300 ease-out"
              >
                <span className="absolute inset-0 -translate-x-full group-hover/mb:translate-x-full
                  bg-gradient-to-r from-transparent via-white/20 to-transparent
                  transition-transform duration-700 ease-in-out" />
                <Sparkles className="w-3.5 h-3.5 relative transition-transform duration-300 group-hover/mb:rotate-12" />
                <span className="relative">Get Started</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
};
