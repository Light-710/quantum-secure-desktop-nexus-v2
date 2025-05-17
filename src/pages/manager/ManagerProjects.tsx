
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ChatPanel from '@/components/chat/ChatPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Filter, FileText, Download, FileUp } from 'lucide-react';
import type { Project } from '@/types/project';
import { reportService } from '@/services/reportService';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const ManagerProjects = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch projects with React Query
  const { 
    data: projects = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['manager-projects', user?.employee_id],
    queryFn: async () => {
      try {
        const response = await api.get(`/manager/projects/${user?.employee_id}`);
        return response.data || [];
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        toast.error('Failed to load projects', {
          description: 'There was an error loading your projects. Please try again later.'
        });
        return [];
      }
    }
  });

  const filteredProjects = projects.filter((project: Project) => 
    statusFilter === 'all' ? true : project.status === statusFilter
  );

  const handleGenerateReport = async (projectId: string) => {
    setLoadingProjectId(projectId);
    try {
      const response = await reportService.generateReport(projectId);
      toast("Report Generation Started", {
        description: response.message || "Your report is being generated and will be available soon."
      });
    } catch (error: any) {
      toast.error("Report Generation Failed", {
        description: error.response?.data?.message || "Failed to start report generation."
      });
    } finally {
      setLoadingProjectId(null);
    }
  };

  const handleDownloadReport = async (projectId: string) => {
    setLoadingProjectId(projectId);
    try {
      const blob = await reportService.downloadReport(projectId);
      
      // Create a link to download the blob
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `project-report-${projectId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast("Report Downloaded", {
        description: "The project report has been downloaded successfully."
      });
    } catch (error: any) {
      toast.error("Download Failed", {
        description: error.response?.data?.message || "Failed to download report."
      });
    } finally {
      setLoadingProjectId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-panel border-warm-100/30 mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-warm-300">Projects Overview</CardTitle>
                <CardDescription className="text-warm-100/70">
                  Manage and monitor all active projects
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warm-300"></div>
                </div>
              ) : filteredProjects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Reports</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>{project.name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {project.status}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(project.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <FileText className="w-4 h-4 mr-2" />
                                Reports
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Project Reports</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4 space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Generate New Report</span>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleGenerateReport(project.id)}
                                    disabled={loadingProjectId === project.id}
                                  >
                                    {loadingProjectId === project.id ? (
                                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                                    ) : (
                                      <FileUp className="h-4 w-4 mr-2" />
                                    )}
                                    Generate
                                  </Button>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Download Latest Report</span>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDownloadReport(project.id)}
                                    disabled={loadingProjectId === project.id}
                                  >
                                    {loadingProjectId === project.id ? (
                                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                                    ) : (
                                      <Download className="h-4 w-4 mr-2" />
                                    )}
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-4 text-warm-100/70">
                  No projects found
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="h-[calc(100vh-8rem)] sticky top-24">
          <ChatPanel />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerProjects;
