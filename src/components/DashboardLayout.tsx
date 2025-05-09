
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, LogOut, LayoutDashboard, Users, Server, Monitor, Activity, Database, Bell, MessageCircle } from 'lucide-react';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getNavItems = () => {
    const roleItems = {
      Employee: [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard/employee' },
        { name: 'Virtual Desktop', icon: <Monitor size={20} />, path: '/dashboard/employee/desktop' },
        { name: 'Chat', icon: <MessageCircle size={20} />, path: '/dashboard/employee/chat' },
      ],
      Manager: [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard/manager' },
        { name: 'Projects', icon: <Activity size={20} />, path: '/dashboard/manager/projects' },
        { name: 'Team', icon: <Users size={20} />, path: '/dashboard/manager/team' },
        { name: 'Chat', icon: <MessageCircle size={20} />, path: '/dashboard/manager/chat' },
      ],
      Admin: [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard/admin' },
        { name: 'Users', icon: <Users size={20} />, path: '/dashboard/admin/users' },
        { name: 'System', icon: <Server size={20} />, path: '/dashboard/admin/system' },
        { name: 'Virtual Desktops', icon: <Monitor size={20} />, path: '/dashboard/admin/virtual-desktops' },
        { name: 'Logs', icon: <Database size={20} />, path: '/dashboard/admin/logs' },
      ],
    };

    return user?.role ? roleItems[user.role as keyof typeof roleItems] || [] : [];
  };

  return (
    <div className="dashboard-layout">
      <aside className={`bg-white border-r border-gray-100 h-screen fixed top-0 left-0 z-30 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-center">
            <Link to={`/dashboard/${user?.role?.toLowerCase()}`} className="flex items-center">
              <span className={`text-2xl font-bold text-orange-500 ${isSidebarOpen ? 'block' : 'hidden'}`}>PTNG</span>
              <span className={`text-2xl font-bold text-orange-500 ${isSidebarOpen ? 'hidden' : 'block'}`}>P</span>
            </Link>
          </div>
          
          <button 
            className="absolute -right-3 top-6 bg-white border border-gray-100 rounded-full p-1"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg 
              className={`w-3 h-3 text-gray-500 transition-transform ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`} 
              viewBox="0 0 24 24"
            >
              <path 
                fill="currentColor" 
                d={isSidebarOpen ? 'M15 6L9 12L15 18' : 'M9 6L15 12L9 18'}
              />
            </svg>
          </button>
          
          <Separator className="my-4" />
          
          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
            {getNavItems().map((item, index) => (
              <Link 
                key={index}
                to={item.path}
                className="flex items-center px-4 py-3 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-colors"
              >
                <span className="text-gray-400">{item.icon}</span>
                {isSidebarOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 border border-gray-100">
                <AvatarImage src={user?.profile_picture} />
                <AvatarFallback className="bg-orange-100 text-orange-600">
                  {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              {isSidebarOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium truncate max-w-[140px]">{user?.name}</p>
                  <p className="text-xs text-gray-500">
                    <span className={`
                      inline-block w-2 h-2 rounded-full mr-1 
                      ${user?.role === 'Admin' ? 'bg-red-500' : user?.role === 'Manager' ? 'bg-green-500' : 'bg-orange-500'}
                    `}></span>
                    {user?.role}
                  </p>
                </div>
              )}
            </div>
            <div className={`mt-4 flex ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-full"
                onClick={() => navigate(`/dashboard/${user?.role?.toLowerCase()}/settings`)}
              >
                <Settings size={18} />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-full hover:bg-red-50 hover:text-red-500"
                onClick={logout}
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </div>
      </aside>
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white sticky top-0 z-20 py-4 px-6 flex items-center justify-between border-b border-gray-100">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {user?.role} Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full"
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </header>
        
        <div className="p-6 bg-gray-50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
