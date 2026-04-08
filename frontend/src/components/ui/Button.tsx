import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50';

  const variants = {
    primary: { backgroundColor: 'var(--primary)', color: 'var(--on-primary)' },
    secondary: { backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface)' },
    ghost: { backgroundColor: 'transparent', color: 'var(--primary)' },
  };

  return (
    <button className={`${base} ${className}`} style={variants[variant]} {...props}>
      {children}
    </button>
  );
}
