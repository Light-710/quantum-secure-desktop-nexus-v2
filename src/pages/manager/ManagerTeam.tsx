
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ChatPanel from '@/components/chat/ChatPanel';
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
import type { Employee } from '@/types/employee';

// Sample data - in a real app, this would come from an API
const employees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Frontend Developer',
    tasks: [
      { id: '1', title: 'Homepage Redesign', status: 'In Progress' },
      { id: '2', title: 'Bug Fixes', status: 'Completed' },
    ],
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Backend Developer',
    tasks: [
      { id: '3', title: 'API Integration', status: 'In Progress' },
      { id: '4', title: 'Database Optimization', status: 'In Progress' },
    ],
  },
];

const ManagerTeam = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-panel border-warm-100/30 mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-warm-300">Team Management</CardTitle>
              <CardDescription className="text-warm-100/70">
                Manage team members and assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Current Tasks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {employee.name}
                        </div>
                      </TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>
                        <ul className="list-disc list-inside">
                          {employee.tasks.map(task => (
                            <li key={task.id} className="text-sm">
                              {task.title}
                              <span className={`ml-2 text-xs ${
                                task.status === 'In Progress' ? 'text-blue-500' : 'text-green-500'
                              }`}>
                                ({task.status})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

export default ManagerTeam;
