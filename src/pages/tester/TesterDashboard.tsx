
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Monitor, MessageCircle } from 'lucide-react';
import { vmService, VMStatus } from '@/services/vmService';

const TesterDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fetch user's assigned projects
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['tester-projects', user?.employee_id],
    queryFn: async () => {
      try {
        const response = await api.get(`/project/get-projects`);
        return response.data || [];
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        toast.error('Failed to load assigned projects');
        return [];
      }
    }
  });

  // Fetch VM status
  const { data: vmStatus, isLoading: isLoadingVmStatus } = useQuery({
    queryKey: ['vm-status', user?.employee_id],
    queryFn: async () => {
      try {
        return await vmService.getVMStatus();
      } catch (error) {
        console.error('Failed to fetch VM status:', error);
        toast.error('Failed to load VM status');
        return { windows: 'Stopped', linux: 'Stopped' };
      }
    }
  });

  return (
    <DashboardLayout>
      {/* Welcome Card */}
      <Card className="glass-panel border-cyber-teal/30 mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-cyber-teal">Tester Dashboard</CardTitle>
          <CardDescription className="text-cyber-gray">
            Welcome back, {user?.name}. Access your testing resources and assigned projects.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Virtual Desktop Access */}
        <div className="md:col-span-2">
          <Card className="glass-panel border-cyber-teal/30 h-full">
            <CardHeader>
              <CardTitle className="text-xl text-cyber-teal flex items-center">
                <Monitor className="mr-2 text-cyber-blue" size={20} />
                Virtual Desktop Access
              </CardTitle>
              <CardDescription className="text-cyber-gray">
                Access your secure testing environments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Windows VM */}
                <div className="border border-cyber-teal/20 rounded-md p-4 bg-cyber-dark-blue/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-cyber-teal font-medium">Windows VM</h4>
                      <p className="text-sm text-cyber-gray">
                        Status: {' '}
                        <span className={
                          isLoadingVmStatus ? "text-yellow-400" :
                          vmStatus?.windows?.toLowerCase() === 'running' ? "text-green-400" : 
                          "text-yellow-400"
                        }>
                          {isLoadingVmStatus ? 'Checking...' : vmStatus?.windows || 'Not Available'}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4 cyber-button"
                    onClick={() => navigate('/dashboard/tester/desktop')}
                  >
                    Manage Windows VM
                  </Button>
                </div>
                
                {/* Linux VM */}
                <div className="border border-cyber-teal/20 rounded-md p-4 bg-cyber-dark-blue/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-cyber-teal font-medium">Linux VM</h4>
                      <p className="text-sm text-cyber-gray">
                        Status: {' '}
                        <span className={
                          isLoadingVmStatus ? "text-yellow-400" :
                          vmStatus?.linux?.toLowerCase() === 'running' ? "text-green-400" : 
                          "text-yellow-400"
                        }>
                          {isLoadingVmStatus ? 'Checking...' : vmStatus?.linux || 'Not Available'}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4 cyber-button"
                    onClick={() => navigate('/dashboard/tester/desktop')}
                  >
                    Manage Linux VM
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Assigned Projects */}
        <div>
          <Card className="glass-panel border-cyber-teal/30 h-full">
            <CardHeader>
              <CardTitle className="text-xl text-cyber-teal flex items-center">
                <svg className="mr-2 text-cyber-blue" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 9V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 7L21 3L17 7ZM21 3H17H21ZM21 3V7V3Z" fill="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Your Projects
              </CardTitle>
              <CardDescription className="text-cyber-gray">
                Projects assigned to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProjects ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin h-6 w-6 border-2 border-cyber-teal border-t-transparent rounded-full"></div>
                </div>
              ) : projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-cyber-teal/20 rounded-md p-3 bg-cyber-dark-blue/20">
                      <h4 className="text-cyber-teal font-medium">{project.name}</h4>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-cyber-gray">{project.description}</span>
                        <span className={
                          project.status === 'In Progress' 
                            ? 'text-cyber-blue' 
                            : project.status === 'Pending' 
                              ? 'text-yellow-400' 
                              : 'text-green-400'
                        }>
                          {project.status}
                        </span>
                      </div>
                      {project.due_date && (
                        <div className="text-xs text-cyber-gray mt-2">
                          Due: {new Date(project.due_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-cyber-gray">
                  No projects assigned to you yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Project Chat */}
      <div className="mt-6">
        <Card className="glass-panel border-cyber-teal/30">
          <CardHeader>
            <CardTitle className="text-xl text-cyber-teal flex items-center">
              <MessageCircle className="mr-2 text-cyber-blue" size={20} />
              Project Communications
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button 
              className="cyber-button"
              onClick={() => navigate('/dashboard/tester/chat')}
            >
              Open Project Chat
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TesterDashboard;
