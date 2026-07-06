import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, LayoutDashboard, Activity } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children?: ReactNode;
  title?: string;
  links?: { label: string; path: string; icon: any }[];
}

export function DashboardLayout({ children, title, links }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  // Infer title from active link if not explicitly provided
  const activeLink = links?.find(l => location.pathname === l.path || location.pathname.startsWith(l.path + '/'));
  const displayTitle = title || activeLink?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 glass border-r border-white/5 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Osan<span className="text-primary">HR</span></span>
        </div>

        <div className="px-4 py-6 flex-1 flex flex-col gap-2">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Main Menu
          </div>
          
          {links ? (
            links.map(link => {
              const Icon = link.icon;
              return (
                <NavLink 
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </NavLink>
              );
            })
          ) : (
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/10 text-white font-medium">
              <LayoutDashboard className="w-5 h-5 text-primary" />
              {displayTitle}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center">
              {profile?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{profile?.name || 'User'}</span>
              <span className="text-xs text-gray-400">{profile?.role || 'Role'}</span>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-white/5 glass flex items-center px-8 shrink-0">
          <h1 className="text-2xl font-bold">{displayTitle}</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-8 relative">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
