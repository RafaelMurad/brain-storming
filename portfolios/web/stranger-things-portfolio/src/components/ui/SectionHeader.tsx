import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  icon?: ReactNode;
  className?: string;
}

/**
 * Consistent section header with neon styling
 * Used across About, Experience, Projects, Skills, Contact sections
 */
export const SectionHeader = ({ 
  title, 
  icon = '◆',
  className = '' 
}: SectionHeaderProps) => {
  return (
    <div className={`mb-16 ${className}`}>
      <div className="flex items-center gap-5 mb-8">
        <div className="text-st-red text-4xl md:text-5xl animate-pulse-slow" aria-hidden="true">
          {icon}
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold neon-red-subtle tracking-wider">
          {title}
        </h2>
      </div>
      <div 
        className="h-1 w-full bg-gradient-to-r from-st-red via-st-red to-transparent shadow-neon-red"
        aria-hidden="true"
      />
    </div>
  );
};
