import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sync with sidebar collapse state from localStorage
  useEffect(() => {
    const checkCollapsedState = () => {
      const savedState = localStorage.getItem('sidebarCollapsed');
      setIsCollapsed(savedState === 'true');
    };

    checkCollapsedState();

    // Listen for storage changes (including from Navigation component)
    window.addEventListener('storage', checkCollapsedState);

    // Poll for changes since same-tab localStorage changes don't fire storage event
    const interval = setInterval(checkCollapsedState, 100);

    return () => {
      window.removeEventListener('storage', checkCollapsedState);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Navigation Sidebar */}
      <Navigation />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-200 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <main className="min-h-screen bg-white">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-slate-500">
              <p>© 2025 Video Analysis Platform. Political speech analysis tool.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}