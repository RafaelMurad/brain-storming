type DividerVariant = 'red' | 'cyan' | 'pink' | 'gray';

interface GlowDividerProps {
  variant?: DividerVariant;
  direction?: 'left' | 'right' | 'center';
  className?: string;
}

const colorMap: Record<DividerVariant, { from: string; shadow: string }> = {
  red: { from: 'from-st-red', shadow: 'shadow-neon-red' },
  cyan: { from: 'from-st-neon-cyan', shadow: 'shadow-neon-cyan' },
  pink: { from: 'from-st-neon-pink', shadow: 'shadow-neon-pink' },
  gray: { from: 'from-st-gray-dark', shadow: '' },
};

const directionStyles = {
  left: 'bg-gradient-to-r',
  right: 'bg-gradient-to-l',
  center: 'bg-gradient-to-r from-transparent via-current',
};

/**
 * Neon glowing divider line
 * Used to separate sections and content blocks
 */
export const GlowDivider = ({ 
  variant = 'red',
  direction = 'left',
  className = '' 
}: GlowDividerProps) => {
  const { from, shadow } = colorMap[variant];
  
  // For center, we use a special gradient
  const gradientClass = direction === 'center'
    ? `bg-gradient-to-r from-transparent ${from.replace('from-', 'via-')} to-transparent`
    : `${directionStyles[direction]} ${from} to-transparent`;

  return (
    <div 
      className={`h-px w-full ${gradientClass} ${shadow} ${className}`}
      aria-hidden="true"
    />
  );
};
