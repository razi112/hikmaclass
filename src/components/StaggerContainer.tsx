import { Children, cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/utils';

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  initialDelay?: number;
}

export function StaggerContainer({ 
  children, 
  staggerDelay = 100,
  initialDelay = 0,
  className 
}: StaggerContainerProps) {
  const childrenArray = Children.toArray(children);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {childrenArray.map((child, index) => {
        if (isValidElement(child)) {
          return cloneElement(child as React.ReactElement<any>, {
            key: index,
            style: {
              ...child.props.style,
              animationDelay: `${initialDelay + index * staggerDelay}ms`,
            },
            className: cn(child.props.className, 'animate-fade-in-up'),
          });
        }
        return child;
      })}
    </div>
  );
}
