import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-2xl p-6 ${className}`}
      style={{
        backgroundColor: 'var(--surface-container-lowest)',
        border: '1px solid var(--outline-variant)',
      }}
    >
      {children}
    </div>
  );
}
