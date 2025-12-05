interface CornerAccentsProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'all' | 'top' | 'bottom';
  hoverEffect?: boolean;
}

const sizeMap = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-24 h-24',
};

/**
 * Corner accent decorations for cards
 * Adds that Stranger Things tech aesthetic
 */
export const CornerAccents = ({ 
  className = '',
  size = 'md',
  position = 'all',
  hoverEffect = true,
}: CornerAccentsProps) => {
  const baseStyles = `absolute border-st-red opacity-30 ${hoverEffect ? 'group-hover:opacity-60' : ''} transition-opacity duration-300`;
  const sizeClass = sizeMap[size];
  
  const showTop = position === 'all' || position === 'top';
  const showBottom = position === 'all' || position === 'bottom';

  return (
    <>
      {showTop && (
        <>
          <div 
            className={`${baseStyles} ${sizeClass} top-0 left-0 border-t-2 border-l-2 ${className}`}
            aria-hidden="true"
          />
          <div 
            className={`${baseStyles} ${sizeClass} top-0 right-0 border-t-2 border-r-2 ${className}`}
            aria-hidden="true"
          />
        </>
      )}
      {showBottom && (
        <>
          <div 
            className={`${baseStyles} ${sizeClass} bottom-0 left-0 border-b-2 border-l-2 ${className}`}
            aria-hidden="true"
          />
          <div 
            className={`${baseStyles} ${sizeClass} bottom-0 right-0 border-b-2 border-r-2 ${className}`}
            aria-hidden="true"
          />
        </>
      )}
    </>
  );
};
