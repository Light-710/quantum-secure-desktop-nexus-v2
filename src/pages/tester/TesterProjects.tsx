
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { toast } from '@/components/ui/sonner';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/services/api';
import { Project } from '@/types/project';

const TesterProjects = () => {
  const { user } = useAuth();

  // Fetch user's assigned projects
  const { data: projects = [], isLoading } = useQuery({
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

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-warm-300">Your Projects</h1>
        <p className="text-warm-200">View and manage all your assigned testing projects.</p>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-warm-200 border-t-warm-300"></div>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: Project) => (
              <Card key={project.id} className="overflow-hidden bg-gradient-to-br from-warm-50 to-white border border-warm-100/30 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-warm-300">{project.name}</CardTitle>
                    <Badge className={`${getStatusColor(project.status)}`}>{project.status}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2 text-warm-200">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-warm-200" />
                      <span className="text-warm-200">
                        {project.start_date ? format(new Date(project.start_date), 'MMM d, yyyy') : 'Not specified'} 
                        {project.end_date ? ` - ${format(new Date(project.end_date), 'MMM d, yyyy')}` : ''}
                      </span>
                    </div>
                    {project.manager_name && (
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-warm-200" />
                        <span className="text-warm-200">Manager: {project.manager_name}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-end">
                  <Button variant="ghost" className="text-warm-300 hover:text-warm-200 hover:bg-warm-50 p-0">
                    View details <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-warm-50 border border-warm-100/30">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-xl font-semibold text-warm-300 mb-2">No projects assigned</h3>
              <p className="text-warm-200 text-center max-w-md">
                You don't have any projects assigned to you yet. New projects will appear here once they are assigned.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TesterProjects;
