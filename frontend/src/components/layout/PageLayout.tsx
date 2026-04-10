import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export function PageLayout({ children, hideHeader = false, hideFooter = false }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#131313]">
      {!hideHeader && <Header />}
      <main className="flex-1 pt-16">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
