import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Upload,
  BarChart3,
  History,
  Menu,
  X,
  Shield,
  GitCompare,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavigationProps {
  className?: string;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Analysis overview'
  },
  {
    name: 'Upload',
    href: '/uploads',
    icon: Upload,
    description: 'Process new content'
  },
  {
    name: 'Analysis History',
    href: '/history',
    icon: History,
    description: 'Previous analyses'
  },
  {
    name: 'Compare',
    href: '/compare',
    icon: GitCompare,
    description: 'Compare analyses'
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
    description: 'Generate reports'
  }
];

export default function Navigation({ className = '' }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  // Save collapsed state to localStorage whenever it changes
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 transition-all duration-200 ${
        isCollapsed ? 'md:w-20' : 'md:w-64'
      } ${className}`}>
        <div className="flex flex-col flex-grow bg-white/95 backdrop-blur-md border-r border-slate-200/80 shadow-sm">
          {/* Brand with Collapse Toggle */}
          <div className={`flex items-center flex-shrink-0 px-5 py-4 border-b border-slate-100/80 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}>
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold tracking-tight">VA</span>
              </div>
              {!isCollapsed && (
                <div className="ml-3">
                  <h1 className="text-sm font-semibold text-slate-900 leading-tight">Video Analysis</h1>
                  <p className="text-[11px] text-slate-500">AI Insights Suite</p>
                </div>
              )}
            </div>

            {/* Collapse Toggle Button - Inside Sidebar */}
            {!isCollapsed && (
              <button
                onClick={toggleCollapse}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors
                  focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <div className="flex-1 pt-4">
            <nav className="px-3 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    title={isCollapsed ? item.name : undefined}
                    className={`group flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3'} py-2 text-sm font-semibold rounded-xl transition-all ${
                      active
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className={`${isCollapsed ? '' : 'mr-3'} inline-flex items-center justify-center h-8 w-8 rounded-lg ${
                      active ? 'bg-white/10' : 'bg-slate-100 group-hover:bg-slate-200'
                    }`}>
                      <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-slate-600 group-hover:text-slate-900'}`} />
                    </span>
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          {!isCollapsed && (
            <div className="flex-shrink-0 mt-auto px-4 py-4 border-t border-slate-200/60">
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/60">
                <div className="flex items-center text-xs text-slate-600">
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-slate-200 mr-3">
                    <Shield className="h-4 w-4 text-slate-700" />
                  </span>
                  <div>
                    <div className="font-semibold text-slate-800 mb-0.5">Secure Processing</div>
                    <div className="text-slate-500 text-[10px]">Files automatically deleted after analysis</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex-shrink-0 mt-auto border-t border-slate-200/60">
              {/* Expand Button in Collapsed State */}
              <div className="px-3 py-3 flex flex-col items-center gap-2">
                <button
                  onClick={toggleCollapse}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors
                    focus:outline-none focus:ring-2 focus:ring-slate-900"
                  aria-label="Expand sidebar"
                  title="Expand sidebar"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/60">
                  <Shield className="h-4 w-4 text-slate-700" />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
              <span className="text-white text-[11px] font-bold tracking-tight">VA</span>
            </div>
            <div className="ml-2">
              <h1 className="text-sm font-semibold text-slate-900 leading-tight">Video Analysis</h1>
            </div>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-lg">
            <div className="px-2 py-3 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 text-base font-semibold rounded-xl transition-colors ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className={`mr-3 inline-flex items-center justify-center h-8 w-8 rounded-lg ${
                      active ? 'bg-white/10' : 'bg-slate-100'
                    }`}>
                      <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-slate-600'}`} />
                    </span>
                    <div className="leading-tight">
                      <div>{item.name}</div>
                      <div className={`text-sm ${
                        active ? 'text-slate-200' : 'text-slate-500'
                      }`}>{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}