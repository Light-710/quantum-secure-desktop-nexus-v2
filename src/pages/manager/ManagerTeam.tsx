
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { userManagementService } from '@/services/userManagementService';
import { Badge } from '@/components/ui/badge';

const ManagerTeam = () => {
  const { user } = useAuth();
  
  // Use React Query to fetch testers
  const { data: testers = [], isLoading: isLoadingTesters } = useQuery({
    queryKey: ['testers'],
    queryFn: async () => {
      try {
        const response = await userManagementService.getAllTesters();
        return response;
      } catch (error) {
        console.error('Failed to fetch testers:', error);
        toast.error('Failed to load team data', {
          description: 'There was an error loading your team members. Please try again later.'
        });
        return [];
      }
    },
  });

  // Use React Query for fetching tasks/projects for the team members
  const { data: teamData = [], isLoading: isLoadingTeamData } = useQuery({
    queryKey: ['team-tasks', user?.employee_id],
    queryFn: async () => {
      try {
        // Get team members for the current manager
        const response = await api.get(`/manager/team/${user?.employee_id}`);
        return response.data || [];
      } catch (error) {
        console.error('Failed to fetch team data:', error);
        toast.error('Failed to load team task data', {
          description: 'There was an error loading your team member tasks. Please try again later.'
        });
        return [];
      }
    },
  });

  // Combine testers with their task data if available
  const teamMembers = testers.map(tester => {
    const memberWithTasks = teamData.find(member => member.employee_id === tester.employee_id);
    return {
      ...tester,
      tasks: memberWithTasks?.tasks || []
    };
  });

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 gap-6">
        <Card className="glass-panel border-warm-100/30 mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-warm-300">Team Management</CardTitle>
            <CardDescription className="text-warm-100/70">
              Manage team members and assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTesters || isLoadingTeamData ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warm-300"></div>
              </div>
            ) : teamMembers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Tasks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((tester) => (
                    <TableRow key={tester.employee_id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {tester.name}
                        </div>
                      </TableCell>
                      <TableCell>{tester.email}</TableCell>
                      <TableCell>
                        {tester.tasks && tester.tasks.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {tester.tasks.map(task => (
                              <li key={task.id} className="text-sm">
                                {task.title}
                                <Badge 
                                  className={`ml-2 ${
                                    task.status === 'In Progress' ? 'bg-blue-500' : 'bg-green-500'
                                  }`}
                                >
                                  {task.status}
                                </Badge>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-warm-100/50 text-sm">No tasks assigned</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-4 text-warm-100/70">
                No team members found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManagerTeam;
