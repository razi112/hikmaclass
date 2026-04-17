import { useEffect, useState } from 'react';

interface Props {
  onDone: () => void;
}

/**
 * "Infinite Mosaic" splash — uses the real Hikma logo image.
 * Phase timeline:
 *   0ms       → logo scales in from 0, black bg
 *   400ms     → logo fully visible, teal glow pulses
 *   1400ms    → gold flash overlay
 *   1900ms    → ring burst expands
 *   2400ms    → fade out entire screen
 *   2900ms    → onDone()
 */
export const SplashScreen = ({ onDone }: Props) => {
  const [phase, setPhase] = useState<'in' | 'glow' | 'flash' | 'exit'>('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('glow'),  400);
    const t2 = setTimeout(() => setPhase('flash'), 1400);
    const t3 = setTimeout(() => setPhase('exit'),  2000);
    const t4 = setTimeout(() => onDone(),          2700);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onDone]);

  const isFlash = phase === 'flash' || phase === 'exit';

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
      style={{
        opacity: phase === 'exit' ? 0 : 1,
        transition: phase === 'exit' ? 'opacity 0.7s ease-in-out' : 'none',
        pointerEvents: phase === 'exit' ? 'none' : 'all',
      }}
    >
      {/* ring burst — fires on flash */}
      {isFlash && (
        <div
          className="absolute rounded-full border-2 border-[#c9952a] pointer-events-none"
          style={{ animation: 'splashRing 0.8s ease-out forwards' }}
        />
      )}

      {/* second ring, slight delay */}
      {isFlash && (
        <div
          className="absolute rounded-full border border-[#1a8fa8] pointer-events-none"
          style={{ animation: 'splashRing 0.9s ease-out 0.1s forwards' }}
        />
      )}

      {/* logo image */}
      <div
        style={{
          position: 'relative',
          transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), filter 0.4s ease',
          transform: phase === 'in' ? 'scale(0.3)' : isFlash ? 'scale(1.06)' : 'scale(1)',
          filter: isFlash
            ? 'drop-shadow(0 0 40px #c9952a) drop-shadow(0 0 80px #c9952a) brightness(1.3)'
            : phase === 'glow'
            ? 'drop-shadow(0 0 24px #1a8fa8) drop-shadow(0 0 48px rgba(26,143,168,0.5))'
            : 'none',
        }}
      >
        <img
          src="https://i.pinimg.com/736x/b0/e1/56/b0e156d9d74c5175238aec1738b527b2.jpg"
          alt="Hikma"
          width={220}
          height={220}
          style={{
            opacity: phase === 'in' ? 0 : 1,
            transition: 'opacity 0.4s ease',
            display: 'block',
          }}
        />
      </div>

      {/* HIKMA label */}
      <div
        style={{
          marginTop: '16px',
          fontFamily: 'serif',
          letterSpacing: '0.4em',
          fontSize: '1.4rem',
          fontWeight: 700,
          color: isFlash ? '#ffffff' : '#c9952a',
          opacity: phase === 'in' ? 0 : 1,
          transition: 'opacity 0.5s ease 0.1s, color 0.3s ease',
          textShadow: isFlash ? '0 0 20px #c9952a' : 'none',
        }}
      >
        CLASS 2026
      </div>

      <style>{`
        @keyframes splashRing {
          from { width: 20px; height: 20px; opacity: 1; }
          to   { width: 600px; height: 600px; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
