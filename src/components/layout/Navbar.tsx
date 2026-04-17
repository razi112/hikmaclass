import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Sparkles } from 'lucide-react';
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

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
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
              </Link>
            ))}
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
