import type { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  containerWidth?: 'sm' | 'md' | 'lg';
  withBackground?: boolean;
  backgroundAccent?: 'red' | 'pink' | 'cyan' | 'none';
}

const containerWidths = {
  sm: 'max-w-content-sm',
  md: 'max-w-content',
  lg: 'max-w-content',
};

const accentColors = {
  red: 'bg-st-red',
  pink: 'bg-st-neon-pink',
  cyan: 'bg-st-neon-cyan',
  none: '',
};

/**
 * Consistent section wrapper with standardized spacing and container width
 * Ensures all sections have the same visual structure
 */
export const Section = ({
  id,
  children,
  className = '',
  containerWidth = 'md',
  withBackground = true,
  backgroundAccent = 'none',
}: SectionProps) => {
  return (
    <section 
      id={id}
      className={`min-h-screen flex items-center justify-center px-6 md:px-8 py-32 md:py-40 relative ${className}`}
    >
      {/* Background accent glow */}
      {withBackground && backgroundAccent !== 'none' && (
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className={`w-[1000px] h-[1000px] ${accentColors[backgroundAccent]} blur-[200px]`} />
        </div>
      )}

      <div className={`${containerWidths[containerWidth]} mx-auto w-full relative z-10`}>
        {children}
      </div>
    </section>
  );
};
