import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

type AnimationDirection = 
  | 'up' 
  | 'down' 
  | 'left' 
  | 'right' 
  | 'scale' 
  | 'blur' 
  | 'fade'
  | 'rotate'
  | 'flip'
  | 'zoom'
  | 'bounce';

interface AnimateInProps {
  children: React.ReactNode;
  direction?: AnimationDirection;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  duration?: 'fast' | 'normal' | 'slow';
}

const directionClass: Record<AnimationDirection, string> = {
  up: 'slide-up',
  down: 'slide-down',
  left: 'slide-left',
  right: 'slide-right',
  scale: 'scale-in',
  blur: 'blur-in slide-up',
  fade: '',
  rotate: 'slide-up',
  flip: 'scale-in',
  zoom: 'scale-in',
  bounce: 'slide-up',
};

const durationClass = {
  fast: 'duration-300',
  normal: 'duration-700',
  slow: 'duration-1000',
};

export function AnimateIn({ 
  children, 
  direction = 'up', 
  delay = 0, 
  className,
  duration = 'normal'
}: AnimateInProps) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref as any}
      className={cn(
        'animate-on-scroll',
        directionClass[direction],
        durationClass[duration],
        isInView && 'in-view',
        className
      )}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
