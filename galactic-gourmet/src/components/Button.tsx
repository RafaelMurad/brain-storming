import { Component, JSX, splitProps } from 'solid-js';

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: JSX.Element;
}

const Button: Component<ButtonProps> = (props) => {
  const [local, others] = splitProps(props, ['variant', 'size', 'children', 'class']);

  const baseStyles = 'inline-flex items-center justify-center font-sans font-medium transition-all duration-300 relative overflow-hidden group';

  const variants = {
    primary: 'bg-gradient-to-r from-gold to-gold-light text-space hover:from-gold-light hover:to-gold shadow-lg hover:shadow-gold/30',
    secondary: 'bg-burgundy text-cream hover:bg-burgundy-light shadow-lg hover:shadow-burgundy/30',
    outline: 'bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-space',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded',
    md: 'px-6 py-3 text-base rounded-md',
    lg: 'px-8 py-4 text-lg rounded-lg',
  };

  const variant = local.variant || 'primary';
  const size = local.size || 'md';

  return (
    <button
      class={`${baseStyles} ${variants[variant]} ${sizes[size]} ${local.class || ''}`}
      {...others}
    >
      <span class="relative z-10 flex items-center gap-2">
        {local.children}
      </span>
      <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </button>
  );
};

export default Button;
