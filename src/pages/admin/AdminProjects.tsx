import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { toast } from '@/components/ui/sonner';
import { FolderOpen, Plus, RefreshCw, Calendar, Users, Archive, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiProject, Project, ProjectFormValues } from '@/types/project';
import { projectService } from '@/services/projectService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Form validation schema
const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  status: z.string().optional(),
  scope: z.string().optional(),
  managerId: z.union([z.string(), z.number()]).optional(),
});

const AdminProjects = () => {
  const { toast: uiToast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [archiveProjectId, setArchiveProjectId] = useState<string | number | null>(null);

  // Map API project to internal Project format
  const mapApiProjectToProject = (apiProject: ApiProject): Project => {
    return {
      id: apiProject.id,
      name: apiProject.name || '',
      description: apiProject.description || '',
      status: apiProject.status || 'not started',
      start_date: apiProject.start_date,
      end_date: apiProject.end_date || '',
      scope: apiProject.scope || '',
      manager: apiProject.manager || 'Not Assigned',
    };
  };

  // Form for creating/editing projects
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scope: '',
      status: 'not started',
      managerId: '', // Changed from manager to managerId
    }
  });

  // Fetch projects with React Query
  const { 
    data: projects = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      try {
        const response = await projectService.getAllProjects();
        
        if (response && Array.isArray(response)) {
          // Map API projects to our internal format
          return response.map(mapApiProjectToProject);
        } else {
          console.error('Unexpected projects API response format:', response);
          toast.error('Invalid projects data format', {
            description: 'The server returned projects in an unexpected format.'
          });
          return [];
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects', {
          description: 'There was an error loading projects. Please try again later.'
        });
        return [];
      }
    }
  });

  // Mutation for creating a new project
  const createProjectMutation = useMutation({
    mutationFn: (projectData: ProjectFormValues) => projectService.createProject(projectData),
    onSuccess: () => {
      toast.success('Project created', {
        description: 'New project has been created successfully.'
      });
      setIsCreateDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create project';
      toast.error('Error', {
        description: errorMessage
      });
    }
  });

  // Mutation for updating a project
  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number, data: ProjectFormValues }) => 
      projectService.updateProject(id, data),
    onSuccess: () => {
      toast.success('Project updated', {
        description: 'Project has been updated successfully.'
      });
      setIsEditDialogOpen(false);
      setSelectedProject(null);
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update project';
      toast.error('Error', {
        description: errorMessage
      });
    }
  });

  // Mutation for archiving a project
  const archiveProjectMutation = useMutation({
    mutationFn: (projectId: string | number) => projectService.archiveProject(projectId),
    onSuccess: () => {
      toast.success('Project archived', {
        description: 'Project has been archived successfully.'
      });
      setArchiveProjectId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to archive project';
      toast.error('Error', {
        description: errorMessage
      });
    }
  });

  // Project stats
  const activeProjects = projects.filter((p: Project) => 
    p.status.toLowerCase() === 'active' || p.status.toLowerCase() === 'in progress'
  ).length;
  
  const completedProjects = projects.filter((p: Project) => 
    p.status.toLowerCase() === 'completed' || p.status.toLowerCase() === 'complete' || p.status.toLowerCase() === 'done'
  ).length;
  
  const onHoldCancelledProjects = projects.filter((p: Project) => 
    ['on hold', 'cancelled', 'not started'].includes(p.status.toLowerCase())
  ).length;

  const handleRefresh = () => {
    refetch();
    toast.success('Projects refreshed', {
      description: 'Project list has been updated.'
    });
  };

  // Form submission for creating a new project
  const handleCreateProject = (values: ProjectFormValues) => {
    createProjectMutation.mutate(values);
  };

  // Form submission for editing a project
  const handleEditProject = (values: ProjectFormValues) => {
    if (selectedProject) {
      updateProjectMutation.mutate({ 
        id: selectedProject.id, 
        data: values 
      });
    }
  };

  // Open edit dialog and populate form with project data
  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    
    form.reset({
      name: project.name,
      description: project.description,
      status: project.status,
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      scope: project.scope || '',
      managerId: project.managerId, // Changed from manager to managerId
    });
    
    setIsEditDialogOpen(true);
  };

  // Handle archiving a project
  const handleArchiveProject = () => {
    if (archiveProjectId !== null) {
      archiveProjectMutation.mutate(archiveProjectId);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (true) {
      case statusLower === 'active' || statusLower === 'in progress':
        return 'bg-green-100 text-green-800 border-green-300';
      case statusLower === 'completed' || statusLower === 'complete' || statusLower === 'done':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case statusLower === 'on hold':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case statusLower === 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
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
              onClick={() => refetch()}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-[#C47D5F] hover:bg-[#B36F51] text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new project.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateProject)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Project name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Project description" 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="scope"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scope</FormLabel>
                          <FormControl>
                            <Input placeholder="Project scope" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="managerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manager ID</FormLabel>
                          <FormControl>
                            <Input 
                              type="text"
                              placeholder="Employee ID of manager" 
                              {...field}
                              onChange={(e) => {
                                // Allow empty field or numeric input
                                if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
                                  field.onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10));
                                }
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the employee ID of the project manager
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        className="bg-[#C47D5F] hover:bg-[#B36F51] text-white"
                        disabled={createProjectMutation.isPending}
                      >
                        {createProjectMutation.isPending && (
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        )}
                        Create Project
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
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
                  <TableHead className="text-[#8E8B85]">Scope</TableHead>
                  <TableHead className="text-[#8E8B85]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin h-6 w-6 border-2 border-[#C47D5F] border-t-transparent rounded-full mr-2"></div>
                        <span className="text-[#8E8B85]">Loading projects...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : projects.length > 0 ? (
                  projects.map((project: Project) => (
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
                          <span className="text-xs">
                            {project.start_date && formatDate(project.start_date)} - 
                            {project.end_date && formatDate(project.end_date)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-[#3E3D3A]">
                        {project.scope || 'Not specified'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-[#D6D2C9] hover:bg-[#F7F5F2] hover:text-[#C47D5F]"
                            onClick={() => handleEditClick(project)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-[#D6D2C9] hover:bg-[#F7F5F2] hover:text-[#A84332]"
                                onClick={() => setArchiveProjectId(project.id)}
                              >
                                <Archive className="h-4 w-4 mr-1" />
                                Archive
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Archive Project</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to archive this project? This will change the project status and it will no longer be active.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setArchiveProjectId(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleArchiveProject}
                                  className="bg-[#A84332]"
                                >
                                  {archiveProjectMutation.isPending && (
                                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                                  )}
                                  Archive Project
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-[#8E8B85]">
                      No projects found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the details of this project.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditProject)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Project description" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="not started">Not Started</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="scope"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scope</FormLabel>
                    <FormControl>
                      <Input placeholder="Project scope" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="managerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manager ID</FormLabel>
                    <FormControl>
                      <Input 
                        type="text"
                        placeholder="Employee ID of manager" 
                        value={field.value?.toString() || ''}
                        onChange={(e) => {
                          // Allow empty field or numeric input
                          if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
                            field.onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10));
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the employee ID of the project manager
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#C47D5F] hover:bg-[#B36F51] text-white"
                  disabled={updateProjectMutation.isPending}
                >
                  {updateProjectMutation.isPending && (
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel border-[#D6D2C9]">
          <CardHeader>
            <CardTitle className="text-lg text-[#3E3D3A]">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#8A9B6E]">
              {activeProjects}
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
              {completedProjects}
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
              {onHoldCancelledProjects}
            </div>
            <p className="text-sm text-[#8E8B85] mt-1">Projects requiring attention</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminProjects;
