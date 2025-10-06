import { useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function TopNavBar() {
  const location = useLocation();

  // Map routes to page titles and subtitles
  const getPageInfo = (): { title: string; subtitle?: string } => {
    const path = location.pathname;

    if (path === '/' || path === '/uploads') {
      return {
        title: 'Video Analysis',
        subtitle: 'Upload and analyze political speech videos for insights'
      };
    }
    if (path === '/dashboard') {
      return {
        title: 'Dashboard',
        subtitle: 'Overview of your analysis activities'
      };
    }
    if (path === '/history') {
      return {
        title: 'Analysis History',
        subtitle: 'View and manage your past analyses'
      };
    }
    if (path.startsWith('/analysis/')) {
      return {
        title: 'Analysis Details',
        subtitle: 'Detailed insights and metrics'
      };
    }
    if (path === '/reports') {
      return {
        title: 'Reports Hub',
        subtitle: 'Generate comprehensive analysis reports'
      };
    }
    if (path === '/compare') {
      return {
        title: 'Compare Analyses',
        subtitle: 'Compare multiple speeches side-by-side'
      };
    }
    if (path === '/compare/results') {
      return {
        title: 'Comparison Results',
        subtitle: 'Detailed comparison insights'
      };
    }

    return { title: 'Video Analysis' };
  };

  // Get breadcrumb items based on current path
  const getBreadcrumbs = (): { label: string; href?: string }[] => {
    const path = location.pathname;

    if (path === '/' || path === '/uploads') return [{ label: 'Upload' }];
    if (path === '/dashboard') return [{ label: 'Dashboard' }];
    if (path === '/history') return [{ label: 'History' }];
    if (path.startsWith('/analysis/')) {
      return [
        { label: 'History', href: '/history' },
        { label: 'Analysis Details' }
      ];
    }
    if (path === '/reports') return [{ label: 'Reports' }];
    if (path === '/compare') return [{ label: 'Compare' }];
    if (path === '/compare/results') {
      return [
        { label: 'Compare', href: '/compare' },
        { label: 'Results' }
      ];
    }

    return [{ label: 'Upload' }];
  };

  const breadcrumbs = getBreadcrumbs();
  const pageInfo = getPageInfo();

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="px-6 py-4">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-slate-900 mb-1">{pageInfo.title}</h1>

        {/* Page Subtitle */}
        {pageInfo.subtitle && (
          <p className="text-slate-600 text-sm mb-2">{pageInfo.subtitle}</p>
        )}

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="h-3 w-3 text-slate-400" />}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-slate-900 font-medium">{crumb.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
