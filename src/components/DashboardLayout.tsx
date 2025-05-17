
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, LogOut, LayoutDashboard, Users, Monitor, Activity, Database, Bell, MessageCircle, FolderOpen } from 'lucide-react';

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
      Tester: [
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
        { name: 'Virtual Desktops', icon: <Monitor size={20} />, path: '/dashboard/admin/virtual-desktops' },
        { name: 'Projects', icon: <FolderOpen size={20} />, path: '/dashboard/admin/projects' },
        { name: 'Chats', icon: <MessageCircle size={20} />, path: '/dashboard/admin/chats' },
      ],
    };

    return user?.role ? roleItems[user.role as keyof typeof roleItems] || [] : [];
  };

  return (
    <div className="dashboard-layout">
      <aside className={`bg-[#FCFAF7] border-r border-[#D6D2C9] h-screen fixed top-0 left-0 z-30 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-center">
            <Link to={`/dashboard/${user?.role?.toLowerCase()}`} className="flex items-center">
              <span className={`text-2xl font-bold text-[#C47D5F] ${isSidebarOpen ? 'block' : 'hidden'}`}>PTNG</span>
              <span className={`text-2xl font-bold text-[#C47D5F] ${isSidebarOpen ? 'hidden' : 'block'}`}>P</span>
            </Link>
          </div>
          
          <button 
            className="absolute -right-3 top-6 bg-[#FCFAF7] border border-[#D6D2C9] rounded-full p-1"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg 
              className={`w-3 h-3 text-[#5F5D58] transition-transform ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`} 
              viewBox="0 0 24 24"
            >
              <path 
                fill="currentColor" 
                d={isSidebarOpen ? 'M15 6L9 12L15 18' : 'M9 6L15 12L9 18'}
              />
            </svg>
          </button>
          
          <Separator className="my-4 bg-[#D6D2C9]" />
          
          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
            {getNavItems().map((item, index) => (
              <Link 
                key={index}
                to={item.path}
                className="flex items-center px-4 py-3 text-[#5F5D58] hover:text-[#C47D5F] hover:bg-[#F7F5F2] rounded-md transition-colors"
              >
                <span className="text-[#A8A39D]">{item.icon}</span>
                {isSidebarOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-[#D6D2C9]">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 border border-[#D6D2C9]">
                <AvatarImage src={user?.profile_picture} />
                <AvatarFallback className="bg-[#C47D5F]/10 text-[#C47D5F]">
                  {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              {isSidebarOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-[#3E3D3A] truncate max-w-[140px]">{user?.name}</p>
                  <p className="text-xs text-[#A8A39D]">
                    <span className={`
                      inline-block w-2 h-2 rounded-full mr-1 
                      ${user?.role === 'Admin' ? 'bg-[#A84332]' : 
                        user?.role === 'Manager' ? 'bg-[#8A9B6E]' : 
                        user?.role === 'Tester' ? 'bg-[#C47D5F]' : 'bg-[#C47D5F]'}
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
                className="rounded-full border-[#D6D2C9] text-[#5F5D58] hover:bg-[#F7F5F2] hover:text-[#C47D5F]"
                onClick={() => navigate(`/dashboard/${user?.role?.toLowerCase()}`)}
              >
                <Settings size={18} />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-full border-[#D6D2C9] text-[#5F5D58] hover:bg-[#A84332]/10 hover:text-[#A84332]"
                onClick={logout}
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </div>
      </aside>
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-[#FCFAF7] sticky top-0 z-20 py-4 px-6 flex items-center justify-between border-b border-[#D6D2C9]">
          <div>
            <h1 className="text-xl font-semibold text-[#3E3D3A]">
              {user?.role} Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full border-[#D6D2C9] text-[#5F5D58] hover:bg-[#F7F5F2]"
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#A84332] text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </header>
        
        <div className="p-6 bg-[#F7F5F2]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
