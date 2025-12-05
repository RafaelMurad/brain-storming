import type { ReactNode } from 'react';

type BadgeVariant = 'red' | 'cyan' | 'pink' | 'outline';

interface NeonBadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<BadgeVariant, string> = {
  red: 'border-st-red text-st-red shadow-neon-red-sm hover:shadow-neon-red',
  cyan: 'border-st-neon-cyan text-st-neon-cyan shadow-neon-cyan-sm hover:shadow-neon-cyan',
  pink: 'border-st-neon-pink text-st-neon-pink shadow-neon-pink-sm hover:shadow-neon-pink',
  outline: 'border-st-gray-mid text-st-gray-light hover:border-st-red hover:text-st-red hover:shadow-neon-red-sm',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-2.5 text-lg',
};

/**
 * Neon-styled badge/tag component
 * Used for skills, tech stack, status indicators
 */
export const NeonBadge = ({ 
  children, 
  variant = 'outline',
  size = 'md',
  className = '' 
}: NeonBadgeProps) => {
  return (
    <span 
      className={`
        inline-flex items-center justify-center
        border-2 font-mono tracking-wide
        bg-st-gray-dark/30
        transition-all duration-300
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
