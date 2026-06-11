import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { useLocation } from 'react-router-dom';
import { Footer } from '../Footer';

const IMMERSIVE_ROUTES = ['/', '/quiz', '/results', '/result', '/admin'];
function isImmersiveRoute(pathname: string) {
  return IMMERSIVE_ROUTES.includes(pathname) ||
    pathname.startsWith('/results/') ||
    pathname.startsWith('/result/') ||
    pathname.startsWith('/admin');
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const location = useLocation();

  if (isImmersiveRoute(location.pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isDesktopCollapsed={isDesktopCollapsed}
        setIsDesktopCollapsed={setIsDesktopCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 w-full relative">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
