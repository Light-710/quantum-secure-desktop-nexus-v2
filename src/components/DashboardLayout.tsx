import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  LayoutDashboard,
  MessageSquare,
  Monitor,
  LogOut,
  Menu,
  X,
  Users,
  Settings,
  FolderKanban,
} from 'lucide-react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const managerLinks = [
    { name: 'Dashboard', path: '/dashboard/manager', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/dashboard/manager/projects', icon: <FolderKanban size={20} /> },
    { name: 'Team', path: '/dashboard/manager/team', icon: <Users size={20} /> },
    { name: 'Chat', path: '/dashboard/manager/chat', icon: <MessageSquare size={20} /> },
    { name: 'Virtual Desktop', path: '/dashboard/manager/desktop', icon: <Monitor size={20} /> },
  ];

  const testerLinks = [
    { name: 'Dashboard', path: '/dashboard/tester', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/dashboard/tester/projects', icon: <FolderKanban size={20} /> },
    { name: 'Chat', path: '/dashboard/tester/chat', icon: <MessageSquare size={20} /> },
    { name: 'Virtual Desktop', path: '/dashboard/tester/desktop', icon: <Monitor size={20} /> },
  ];
  
  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/dashboard/admin/projects', icon: <FolderKanban size={20} /> },
    { name: 'Users', path: '/dashboard/admin/users', icon: <Users size={20} /> },
    { name: 'Virtual Desktop', path: '/dashboard/admin/vm', icon: <Monitor size={20} /> },
    { name: 'Settings', path: '/dashboard/admin/settings', icon: <Settings size={20} /> },
  ];

  let links = testerLinks; // Default to tester links
  
  if (user?.role === 'Manager') {
    links = managerLinks;
  } else if (user?.role === 'Admin') {
    links = adminLinks;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-warm-50">
      {/* Sidebar for desktop */}
      <aside
        className={`fixed inset-y-0 z-50 flex flex-col w-64 transition-transform duration-300 bg-white border-r border-warm-100/30 shadow-sm ${
          sidebarOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-warm-100/30">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-warm-300">PenTest NG</span>
          </Link>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X size={20} />
            </Button>
          )}
        </div>

        <div className="flex flex-col flex-grow p-4 overflow-y-auto">
          <nav className="flex flex-col flex-grow space-y-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                  location.pathname === link.path
                    ? 'bg-warm-100/30 text-warm-300 font-medium'
                    : 'text-warm-200 hover:bg-warm-50 hover:text-warm-300'
                }`}
              >
                <span className="mr-3 text-warm-200">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-warm-100/20">
            <div className="px-4 py-2">
              <p className="text-xs text-warm-200">Signed in as</p>
              <p className="text-sm font-medium text-warm-300">{user?.name}</p>
              <p className="text-xs text-warm-200">{user?.email}</p>
              <p className="text-xs font-medium mt-1 text-warm-200">{user?.role}</p>
            </div>

            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 mt-2 text-warm-200 hover:bg-warm-50 hover:text-warm-300"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>

            <div className="mt-2 flex justify-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content */}
      <main className="flex flex-col flex-grow overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center h-16 px-4 bg-white border-b border-warm-100/30 shadow-sm">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-4">
              <Menu size={20} />
            </Button>
          )}
          <div className="flex-grow">
            <h1 className="text-lg font-medium text-warm-300">
              {location.pathname.split('/').pop()?.charAt(0).toUpperCase() + location.pathname.split('/').pop()?.slice(1) || 'Dashboard'}
            </h1>
          </div>
        </header>
        
        {/* Page content */}
        <div className="flex-grow p-4 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
