import { Component, JSX, splitProps } from 'solid-js';

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'beacon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  glowColor?: 'green' | 'purple' | 'teal';
  children: JSX.Element;
}

const Button: Component<ButtonProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'variant',
    'size',
    'loading',
    'glowColor',
    'children',
    'class',
  ]);

  const variant = () => local.variant || 'primary';
  const size = () => local.size || 'md';
  const glowColor = () => local.glowColor || 'green';

  const baseClasses = `
    relative inline-flex items-center justify-center font-mono font-medium
    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
    overflow-hidden group
  `;

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs rounded-lg',
    md: 'px-6 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-xl',
  };

  const glowClasses = {
    green: {
      bg: 'bg-alien-glow',
      text: 'text-alien-void',
      border: 'border-alien-glow',
      shadow: 'shadow-glow hover:shadow-glow-lg',
      ring: 'focus:ring-alien-glow/50',
    },
    purple: {
      bg: 'bg-alien-purple',
      text: 'text-white',
      border: 'border-alien-purple',
      shadow: 'shadow-glow-purple hover:shadow-[0_0_30px_rgba(157,78,221,0.6)]',
      ring: 'focus:ring-alien-purple/50',
    },
    teal: {
      bg: 'bg-alien-teal',
      text: 'text-alien-void',
      border: 'border-alien-teal',
      shadow: 'shadow-glow-teal hover:shadow-[0_0_30px_rgba(46,196,182,0.6)]',
      ring: 'focus:ring-alien-teal/50',
    },
  };

  const variantClasses = () => {
    const colors = glowClasses[glowColor()];

    switch (variant()) {
      case 'primary':
        return `${colors.bg} ${colors.text} ${colors.shadow} hover:scale-105 focus:outline-none focus:ring-2 ${colors.ring}`;
      case 'secondary':
        return `bg-transparent border-2 ${colors.border} text-${glowColor() === 'green' ? 'alien-glow' : glowColor() === 'purple' ? 'alien-purple' : 'alien-teal'} hover:bg-${glowColor() === 'green' ? 'alien-glow' : glowColor() === 'purple' ? 'alien-purple' : 'alien-teal'}/10 focus:outline-none focus:ring-2 ${colors.ring}`;
      case 'ghost':
        return `bg-alien-void-lighter/50 text-gray-300 hover:text-alien-glow hover:bg-alien-void-lighter border border-alien-glow/20 hover:border-alien-glow/50`;
      case 'beacon':
        return `${colors.bg} ${colors.text} ${colors.shadow} animate-pulse-glow`;
      default:
        return '';
    }
  };

  return (
    <button
      class={`${baseClasses} ${sizeClasses[size()]} ${variantClasses()} ${local.class || ''}`}
      disabled={local.loading || rest.disabled}
      {...rest}
    >
      {/* Scan line effect */}
      <span class="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100">
        <span class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent transform -translate-y-full group-hover:translate-y-full transition-transform duration-500" />
      </span>

      {/* Loading spinner */}
      {local.loading && (
        <span class="absolute inset-0 flex items-center justify-center bg-inherit">
          <svg
            class="w-5 h-5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}

      {/* Content */}
      <span class={local.loading ? 'invisible' : 'relative z-10 flex items-center gap-2'}>
        {local.children}
      </span>

      {/* Corner accents */}
      <span class="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-50" />
      <span class="absolute top-0 right-0 w-2 h-2 border-t border-r border-current opacity-50" />
      <span class="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current opacity-50" />
      <span class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-50" />
    </button>
  );
};

export default Button;

// Link styled as button
export interface LinkButtonProps {
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'beacon';
  size?: 'sm' | 'md' | 'lg';
  glowColor?: 'green' | 'purple' | 'teal';
  class?: string;
  children: JSX.Element;
}

export const LinkButton: Component<LinkButtonProps> = (props) => {
  const variant = () => props.variant || 'primary';
  const size = () => props.size || 'md';
  const glowColor = () => props.glowColor || 'green';

  const baseClasses = `
    relative inline-flex items-center justify-center font-mono font-medium
    transition-all duration-300 overflow-hidden group cursor-pointer
  `;

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs rounded-lg',
    md: 'px-6 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-xl',
  };

  const glowClasses = {
    green: {
      bg: 'bg-alien-glow',
      text: 'text-alien-void',
      border: 'border-alien-glow',
      shadow: 'shadow-glow hover:shadow-glow-lg',
    },
    purple: {
      bg: 'bg-alien-purple',
      text: 'text-white',
      border: 'border-alien-purple',
      shadow: 'shadow-glow-purple hover:shadow-[0_0_30px_rgba(157,78,221,0.6)]',
    },
    teal: {
      bg: 'bg-alien-teal',
      text: 'text-alien-void',
      border: 'border-alien-teal',
      shadow: 'shadow-glow-teal hover:shadow-[0_0_30px_rgba(46,196,182,0.6)]',
    },
  };

  const variantClasses = () => {
    const colors = glowClasses[glowColor()];

    switch (variant()) {
      case 'primary':
        return `${colors.bg} ${colors.text} ${colors.shadow} hover:scale-105`;
      case 'secondary':
        return `bg-transparent border-2 ${colors.border} text-${glowColor() === 'green' ? 'alien-glow' : glowColor() === 'purple' ? 'alien-purple' : 'alien-teal'} hover:bg-${glowColor() === 'green' ? 'alien-glow' : glowColor() === 'purple' ? 'alien-purple' : 'alien-teal'}/10`;
      case 'ghost':
        return `bg-alien-void-lighter/50 text-gray-300 hover:text-alien-glow hover:bg-alien-void-lighter border border-alien-glow/20 hover:border-alien-glow/50`;
      default:
        return '';
    }
  };

  return (
    <a
      href={props.href}
      class={`${baseClasses} ${sizeClasses[size()]} ${variantClasses()} ${props.class || ''}`}
    >
      <span class="relative z-10 flex items-center gap-2">
        {props.children}
      </span>
      <span class="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-50" />
      <span class="absolute top-0 right-0 w-2 h-2 border-t border-r border-current opacity-50" />
      <span class="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current opacity-50" />
      <span class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-50" />
    </a>
  );
};
