import { Component, JSX } from 'solid-js';

interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit';
  class?: string;
  children: JSX.Element;
}

const Button: Component<ButtonProps> = (props) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 px-8 py-4 font-display font-semibold transition-all duration-300 clip-path-cyber';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-neon-cyan to-neon-blue text-cyber-dark hover:shadow-[0_0_30px_rgba(0,255,249,0.5)] hover:-translate-y-1',
    secondary: 'border-2 border-neon-magenta text-neon-magenta hover:bg-neon-magenta/10 hover:shadow-[0_0_30px_rgba(255,0,255,0.3)]',
  };

  const classes = () => `${baseClasses} ${variantClasses[props.variant || 'primary']} ${props.class || ''}`;

  return props.href ? (
    <a href={props.href} class={classes()}>
      {props.children}
    </a>
  ) : (
    <button type={props.type || 'button'} class={classes()}>
      {props.children}
    </button>
  );
};

export default Button;
