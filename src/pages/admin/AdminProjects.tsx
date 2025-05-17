
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { FolderOpen, Plus, RefreshCw, Calendar, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Project = {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
  startDate: string;
  endDate: string;
  teamSize: number;
  manager: string;
  managerId: string;
};

const AdminProjects = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // For now, use sample data
      const sampleProjects: Project[] = [
        {
          id: 'PRJ001',
          name: 'Cloud Migration',
          description: 'Migration of on-premise infrastructure to cloud',
          status: 'Active',
          startDate: '2023-09-01',
          endDate: '2024-06-30',
          teamSize: 8,
          manager: 'Sarah Johnson',
          managerId: 'M001',
        },
        {
          id: 'PRJ002',
          name: 'Security Audit',
          description: 'Complete security audit of all systems',
          status: 'Completed',
          startDate: '2023-11-15',
          endDate: '2024-02-28',
          teamSize: 3,
          manager: 'Michael Chen',
          managerId: 'M002',
        },
        {
          id: 'PRJ003',
          name: 'New CRM Implementation',
          description: 'Implementation of new customer relationship management system',
          status: 'On Hold',
          startDate: '2024-01-10',
          endDate: '2024-08-31',
          teamSize: 6,
          manager: 'Emily Rodriguez',
          managerId: 'M003',
        }
      ];
      
      setProjects(sampleProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleRefresh = () => {
    fetchProjects();
    toast({
      title: "Refreshed",
      description: "Project list has been updated.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'On Hold':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <DashboardLayout>
      <Card className="glass-panel border-[#D6D2C9] mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-[#3E3D3A]">Project Management</CardTitle>
            <CardDescription className="text-[#8E8B85]">
              View and manage all company projects
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="border-[#D6D2C9] hover:bg-[#F7F5F2] hover:text-[#C47D5F]"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
            <Button
              className="bg-[#C47D5F] hover:bg-[#B36F51] text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#D6D2C9] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F7F5F2]">
                <TableRow>
                  <TableHead className="text-[#8E8B85]">Project ID</TableHead>
                  <TableHead className="text-[#8E8B85]">Name</TableHead>
                  <TableHead className="text-[#8E8B85]">Status</TableHead>
                  <TableHead className="text-[#8E8B85]">Timeline</TableHead>
                  <TableHead className="text-[#8E8B85]">Team</TableHead>
                  <TableHead className="text-[#8E8B85]">Manager</TableHead>
                  <TableHead className="text-[#8E8B85]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin h-6 w-6 border-2 border-[#C47D5F] border-t-transparent rounded-full mr-2"></div>
                        <span className="text-[#8E8B85]">Loading projects...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : projects.length > 0 ? (
                  projects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-[#F7F5F2]">
                      <TableCell className="font-mono text-sm text-[#8E8B85]">{project.id}</TableCell>
                      <TableCell>
                        <div className="font-medium text-[#3E3D3A]">{project.name}</div>
                        <div className="text-xs text-[#8E8B85] mt-1">{project.description}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(project.status)} border text-xs font-normal`}>
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-[#8E8B85]">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="text-xs">{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-[#8E8B85]">
                          <Users className="h-3 w-3 mr-1" />
                          <span className="text-xs">{project.teamSize} members</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-[#3E3D3A]">{project.manager}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-[#D6D2C9] hover:bg-[#F7F5F2] hover:text-[#C47D5F]"
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-[#D6D2C9] hover:bg-[#F7F5F2] hover:text-[#C47D5F]"
                          >
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-[#8E8B85]">
                      No projects found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel border-[#D6D2C9]">
          <CardHeader>
            <CardTitle className="text-lg text-[#3E3D3A]">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#8A9B6E]">
              {projects.filter(p => p.status === 'Active').length}
            </div>
            <p className="text-sm text-[#8E8B85] mt-1">Current ongoing projects</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-[#D6D2C9]">
          <CardHeader>
            <CardTitle className="text-lg text-[#3E3D3A]">Completed Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#6D98BA]">
              {projects.filter(p => p.status === 'Completed').length}
            </div>
            <p className="text-sm text-[#8E8B85] mt-1">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-[#D6D2C9]">
          <CardHeader>
            <CardTitle className="text-lg text-[#3E3D3A]">On Hold/Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#C47D5F]">
              {projects.filter(p => p.status === 'On Hold' || p.status === 'Cancelled').length}
            </div>
            <p className="text-sm text-[#8E8B85] mt-1">Projects requiring attention</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminProjects;
