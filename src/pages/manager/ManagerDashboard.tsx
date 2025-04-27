
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { Plus, Users, FileText, Calendar, AlignJustify, Building, Activity, BarChart3 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ChatPanel from '@/components/chat/ChatPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const ManagerDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Add new state for form fields
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectScope, setNewProjectScope] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Sample projects data
  const projects = [
    { id: 'PR001', name: 'Web Application Penetration Test', team: 3, status: 'In Progress', dueDate: '2025-05-10', progress: 65 },
    { id: 'PR002', name: 'Cloud Infrastructure Assessment', team: 4, status: 'Completed', dueDate: '2025-04-20', progress: 100 },
    { id: 'PR003', name: 'Network Vulnerability Scan', team: 2, status: 'Pending', dueDate: '2025-05-15', progress: 0 },
    { id: 'PR004', name: 'Mobile App Security Audit', team: 3, status: 'In Progress', dueDate: '2025-06-01', progress: 30 },
  ];
  
  // Sample team data
  const teamMembers = [
    { id: 'EMP001', name: 'John Employee', role: 'Security Analyst', status: 'Active', projects: 2 },
    { id: 'EMP002', name: 'Alice Tester', role: 'Penetration Tester', status: 'Active', projects: 3 },
    { id: 'EMP003', name: 'Mark Security', role: 'Security Engineer', status: 'Away', projects: 1 },
    { id: 'EMP004', name: 'Sarah Analyst', role: 'Security Analyst', status: 'Active', projects: 2 },
  ];
  
  const handleCreateProject = () => {
    if (newProjectName) {
      toast({
        title: "Project Created",
        description: `"${newProjectName}" has been created successfully.`,
      });
      
      // Reset form fields
      setNewProjectName('');
      setNewProjectDesc('');
      setNewProjectScope('');
      setStartDate(undefined);
      setEndDate(undefined);
      setSelectedTeamMembers([]);
      setClientName('');
      setClientEmail('');
      setIsDialogOpen(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Welcome Card */}
          <Card className="glass-panel border-cyber-teal/30 mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-cyber-teal">Manager Dashboard - Project Management</CardTitle>
              <CardDescription className="text-cyber-gray">
                Manage projects, assign team members, and monitor project progress
              </CardDescription>
            </CardHeader>
          </Card>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="glass-panel border-cyber-teal/30 hover:border-cyber-blue/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyber-gray text-sm">Total Projects</p>
                    <h3 className="text-3xl font-bold text-cyber-blue mt-1">12</h3>
                  </div>
                  <div className="bg-cyber-blue/10 p-3 rounded-full">
                    <Activity className="h-6 w-6 text-cyber-blue" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-cyber-gray">
                  <span className="text-green-400">↑ 8%</span> from last month
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-cyber-teal/30 hover:border-cyber-green/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyber-gray text-sm">Team Members</p>
                    <h3 className="text-3xl font-bold text-cyber-green mt-1">8</h3>
                  </div>
                  <div className="bg-cyber-green/10 p-3 rounded-full">
                    <Users className="h-6 w-6 text-cyber-green" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-cyber-gray">
                  <span className="text-green-400">↑ 2</span> new this quarter
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-cyber-teal/30 hover:border-cyber-teal/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyber-gray text-sm">Completed</p>
                    <h3 className="text-3xl font-bold text-cyber-teal mt-1">7</h3>
                  </div>
                  <div className="bg-cyber-teal/10 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-cyber-teal" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-cyber-gray">
                  <span className="text-green-400">↑ 15%</span> completion rate
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-cyber-teal/30 hover:border-cyber-purple/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyber-gray text-sm">Upcoming</p>
                    <h3 className="text-3xl font-bold text-purple-400 mt-1">3</h3>
                  </div>
                  <div className="bg-purple-400/10 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-cyber-gray">
                  <span className="text-yellow-400">⚠</span> 1 due this week
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Projects and Team Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Projects Section */}
            <div className="lg:col-span-2">
              <Card className="glass-panel border-cyber-teal/30 h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-cyber-teal">Projects</CardTitle>
                    <CardDescription className="text-cyber-gray">
                      Manage and monitor your team's projects
                    </CardDescription>
                  </div>
                  
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="cyber-button">
                        <Plus className="mr-2 h-4 w-4" /> New Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] glass-panel border-cyber-teal/30">
                      <DialogHeader>
                        <DialogTitle className="text-xl text-cyber-teal">Create New Project</DialogTitle>
                        <DialogDescription className="text-cyber-gray">
                          Fill in the details for your new security testing project
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
                        {/* Project Name and Description */}
                        <div className="space-y-2">
                          <Label htmlFor="project-name" className="text-cyber-teal">Project Name</Label>
                          <Input
                            id="project-name"
                            placeholder="Enter project name"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            className="bg-cyber-dark-blue/50 border-cyber-teal/30 text-cyber-teal"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="project-desc" className="text-cyber-teal">Description</Label>
                          <Textarea
                            id="project-desc"
                            placeholder="Brief project description"
                            value={newProjectDesc}
                            onChange={(e) => setNewProjectDesc(e.target.value)}
                            className="bg-cyber-dark-blue/50 border-cyber-teal/30 text-cyber-teal min-h-[100px]"
                          />
                        </div>
                        
                        {/* Project Scope */}
                        <div className="space-y-2">
                          <Label htmlFor="project-scope" className="text-cyber-teal">Project Scope</Label>
                          <Textarea
                            id="project-scope"
                            placeholder="Define the project scope and objectives"
                            value={newProjectScope}
                            onChange={(e) => setNewProjectScope(e.target.value)}
                            className="bg-cyber-dark-blue/50 border-cyber-teal/30 text-cyber-teal min-h-[100px]"
                          />
                        </div>
                        
                        {/* Timeline */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="start-date" className="text-cyber-teal">Start Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal border-cyber-teal/30",
                                    !startDate && "text-muted-foreground"
                                  )}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={startDate}
                                  onSelect={setStartDate}
                                  initialFocus
                                  className="bg-cyber-dark-blue/90 border-cyber-teal/30 pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="end-date" className="text-cyber-teal">End Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal border-cyber-teal/30",
                                    !endDate && "text-muted-foreground"
                                  )}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={endDate}
                                  onSelect={setEndDate}
                                  initialFocus
                                  className="bg-cyber-dark-blue/90 border-cyber-teal/30 pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        
                        {/* Team Members Selection */}
                        <div className="space-y-2">
                          <Label className="text-cyber-teal">Team Members</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {teamMembers.map((member) => (
                              <div
                                key={member.id}
                                className={cn(
                                  "flex items-center space-x-2 border border-cyber-teal/30 rounded-md p-2 cursor-pointer transition-colors",
                                  selectedTeamMembers.includes(member.id)
                                    ? "bg-cyber-blue/20 border-cyber-blue"
                                    : "bg-cyber-dark-blue/50 hover:bg-cyber-dark-blue/70"
                                )}
                                onClick={() => {
                                  setSelectedTeamMembers(prev =>
                                    prev.includes(member.id)
                                      ? prev.filter(id => id !== member.id)
                                      : [...prev, member.id]
                                  );
                                }}
                              >
                                <div className="w-8 h-8 rounded-full bg-cyber-dark-blue flex items-center justify-center text-cyber-teal border border-cyber-teal/30">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-cyber-teal">{member.name}</p>
                                  <p className="text-xs text-cyber-gray">{member.role}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Client Details */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="client-name" className="text-cyber-teal">Client Name</Label>
                            <Input
                              id="client-name"
                              placeholder="Enter client name"
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              className="bg-cyber-dark-blue/50 border-cyber-teal/30 text-cyber-teal"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="client-email" className="text-cyber-teal">Client Email</Label>
                            <Input
                              id="client-email"
                              type="email"
                              placeholder="Enter client email"
                              value={clientEmail}
                              onChange={(e) => setClientEmail(e.target.value)}
                              className="bg-cyber-dark-blue/50 border-cyber-teal/30 text-cyber-teal"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsDialogOpen(false)}
                          className="border-cyber-teal/30 hover:bg-cyber-red/20 hover:text-cyber-red"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleCreateProject}
                          className="cyber-button"
                        >
                          Create Project
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="border border-cyber-teal/20 rounded-md p-4 bg-cyber-dark-blue/20">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-cyber-teal font-medium">{project.name}</h4>
                            <div className="flex space-x-4 mt-1">
                              <span className="text-xs text-cyber-gray">ID: {project.id}</span>
                              <span className="text-xs text-cyber-gray">Team: {project.team} members</span>
                              <span className="text-xs text-cyber-gray">Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className={`text-sm px-2 py-1 rounded-full ${
                            project.status === 'In Progress' 
                              ? 'bg-cyber-blue/20 text-cyber-blue' 
                              : project.status === 'Completed' 
                                ? 'bg-green-400/20 text-green-400' 
                                : 'bg-yellow-400/20 text-yellow-400'
                          }`}>
                            {project.status}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-cyber-gray">Progress</span>
                            <span className="text-xs text-cyber-teal">{project.progress}%</span>
                          </div>
                          <div className="h-2 bg-cyber-dark-blue rounded overflow-hidden">
                            <div 
                              className={`h-full ${
                                project.status === 'Completed' 
                                  ? 'bg-green-400' 
                                  : 'bg-cyber-blue'
                              }`} 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue"
                          >
                            Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-cyber-teal/30 hover:bg-cyber-green/20 hover:text-cyber-green"
                          >
                            <Users size={14} className="mr-1" /> Assign
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-cyber-teal/30 hover:bg-purple-400/20 hover:text-purple-400"
                          >
                            <FileText size={14} className="mr-1" /> Report
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Team Section */}
            <div>
              <Card className="glass-panel border-cyber-teal/30 h-full">
                <CardHeader>
                  <CardTitle className="text-xl text-cyber-teal flex items-center">
                    <Users className="mr-2 text-cyber-blue" size={20} />
                    Team Members
                  </CardTitle>
                  <CardDescription className="text-cyber-gray">
                    Your team and their assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center space-x-3 border border-cyber-teal/20 rounded-md p-3 bg-cyber-dark-blue/20">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-cyber-dark-blue flex items-center justify-center text-cyber-teal border border-cyber-teal/30">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-cyber-teal truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-cyber-gray truncate">
                            {member.role}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className={`text-xs px-2 py-0.5 rounded-full ${
                            member.status === 'Active' 
                              ? 'bg-green-400/20 text-green-400' 
                              : 'bg-yellow-400/20 text-yellow-400'
                          }`}>
                            {member.status}
                          </div>
                          <p className="text-xs text-cyber-gray mt-1">
                            {member.projects} projects
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue mt-2"
                    >
                      View All Team Members
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Project Performance */}
          <div className="mt-6">
            <Card className="glass-panel border-cyber-teal/30">
              <CardHeader>
                <CardTitle className="text-xl text-cyber-teal flex items-center">
                  <BarChart3 className="mr-2 text-cyber-blue" size={20} />
                  Project Performance
                </CardTitle>
                <CardDescription className="text-cyber-gray">
                  Overview of your team's performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Completion Rate */}
                  <div className="border border-cyber-teal/20 rounded-md p-4 bg-cyber-dark-blue/20">
                    <h4 className="text-sm text-cyber-gray">Completion Rate</h4>
                    <div className="flex items-end justify-between mt-2">
                      <div className="text-3xl font-semibold text-cyber-blue">75%</div>
                      <div className="text-xs text-green-400">↑ 5%</div>
                    </div>
                    <div className="mt-4 h-2 bg-cyber-dark-blue rounded overflow-hidden">
                      <div className="h-full bg-cyber-blue" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  {/* On-Time Delivery */}
                  <div className="border border-cyber-teal/20 rounded-md p-4 bg-cyber-dark-blue/20">
                    <h4 className="text-sm text-cyber-gray">On-Time Delivery</h4>
                    <div className="flex items-end justify-between mt-2">
                      <div className="text-3xl font-semibold text-cyber-green">88%</div>
                      <div className="text-xs text-green-400">↑ 12%</div>
                    </div>
                    <div className="mt-4 h-2 bg-cyber-dark-blue rounded overflow-hidden">
                      <div className="h-full bg-cyber-green" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  
                  {/* Resource Utilization */}
                  <div className="border border-cyber-teal/20 rounded-md p-4 bg-cyber-dark-blue/20">
                    <h4 className="text-sm text-cyber-gray">Resource Utilization</h4>
                    <div className="flex items-end justify-between mt-2">
                      <div className="text-3xl font-semibold text-purple-400">92%</div>
                      <div className="text-xs text-green-400">↑ 3%</div>
                    </div>
                    <div className="mt-4 h-2 bg-cyber-dark-blue rounded overflow-hidden">
                      <div className="h-full bg-purple-400" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="h-[calc(100vh-8rem)] sticky top-24">
          <ChatPanel />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;

