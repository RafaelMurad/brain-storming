import type { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-st-red text-st-deep-black font-bold
    border-2 border-st-red
    shadow-neon-red-md
    hover:bg-transparent hover:text-st-red hover:shadow-neon-red-lg
    focus:ring-2 focus:ring-st-red focus:ring-offset-2 focus:ring-offset-st-deep-black
  `,
  secondary: `
    bg-st-neon-cyan text-st-deep-black font-bold
    border-2 border-st-neon-cyan
    shadow-neon-cyan-md
    hover:bg-transparent hover:text-st-neon-cyan hover:shadow-neon-cyan
    focus:ring-2 focus:ring-st-neon-cyan focus:ring-offset-2 focus:ring-offset-st-deep-black
  `,
  outline: `
    bg-transparent text-st-red
    border-2 border-st-red
    shadow-neon-red-sm
    hover:bg-st-red/10 hover:shadow-neon-red-md
    focus:ring-2 focus:ring-st-red focus:ring-offset-2 focus:ring-offset-st-deep-black
  `,
  ghost: `
    bg-transparent text-st-gray-light
    border-2 border-st-gray-mid
    hover:border-st-red hover:text-st-red hover:shadow-neon-red-sm
    focus:ring-2 focus:ring-st-red focus:ring-offset-2 focus:ring-offset-st-deep-black
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-body-sm',
  md: 'px-6 py-3 text-body',
  lg: 'px-8 py-4 text-body-lg',
};

/**
 * Neon-styled button with multiple variants
 * Can render as button or anchor tag
 */
export const NeonButton = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  ...props
}: NeonButtonProps) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-mono tracking-wider uppercase
    transition-all duration-300
    focus:outline-none
    disabled:opacity-50 disabled:cursor-not-allowed
  `;
  
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedStyles}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedStyles} {...props}>
      {children}
    </button>
  );
};
