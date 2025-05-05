import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  AlertTriangle, Info, AlertCircle, Database, User, Server, Monitor, Search, 
  Download, RefreshCw 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Log type definition
type LogEntry = {
  id: string;
  timestamp: string;
  level: 'Info' | 'Warning' | 'Error' | 'Critical';
  category: 'System' | 'User' | 'Security' | 'Database' | 'VM';
  message: string;
  user?: string;
  ip?: string;
};

// Sample log data
const generateLogs = (): LogEntry[] => {
  const logs: LogEntry[] = [
    {
      id: 'LOG0001',
      timestamp: '2025-04-27 09:32:15',
      level: 'Info',
      category: 'User',
      message: 'User john_emp logged in successfully',
      user: 'john_emp',
      ip: '192.168.1.45',
    },
    {
      id: 'LOG0002',
      timestamp: '2025-04-27 09:28:33',
      level: 'Warning',
      category: 'Security',
      message: 'Failed login attempt for user admin',
      user: 'admin',
      ip: '203.0.113.42',
    },
    {
      id: 'LOG0003',
      timestamp: '2025-04-27 08:45:22',
      level: 'Info',
      category: 'VM',
      message: 'Virtual machine VM001 started',
      user: 'jane_mgr',
      ip: '192.168.1.46',
    },
    {
      id: 'LOG0004',
      timestamp: '2025-04-27 07:12:33',
      level: 'Error',
      category: 'Database',
      message: 'Database connection timeout',
      user: 'system',
      ip: '127.0.0.1',
    },
    {
      id: 'LOG0005',
      timestamp: '2025-04-27 06:55:10',
      level: 'Info',
      category: 'System',
      message: 'System backup completed successfully',
      user: 'system',
      ip: '127.0.0.1',
    },
    {
      id: 'LOG0006',
      timestamp: '2025-04-26 23:14:05',
      level: 'Warning',
      category: 'System',
      message: 'High CPU usage detected (92%)',
      user: 'system',
      ip: '127.0.0.1',
    },
    {
      id: 'LOG0007',
      timestamp: '2025-04-26 21:30:12',
      level: 'Info',
      category: 'Security',
      message: 'Security scan completed',
      user: 'system',
      ip: '127.0.0.1',
    },
    {
      id: 'LOG0008',
      timestamp: '2025-04-26 19:42:57',
      level: 'Critical',
      category: 'Security',
      message: 'Multiple failed login attempts detected from IP 203.0.113.42',
      user: 'system',
      ip: '127.0.0.1',
    },
    {
      id: 'LOG0009',
      timestamp: '2025-04-26 18:23:11',
      level: 'Error',
      category: 'VM',
      message: 'VM003 crashed unexpectedly',
      user: 'system',
      ip: '127.0.0.1',
    },
    {
      id: 'LOG0010',
      timestamp: '2025-04-26 17:05:33',
      level: 'Info',
      category: 'User',
      message: 'User alex_adm modified system settings',
      user: 'alex_adm',
      ip: '192.168.1.47',
    },
    {
      id: 'LOG0011',
      timestamp: '2025-04-26 15:12:09',
      level: 'Warning',
      category: 'Database',
      message: 'Database reaching storage capacity (85%)',
      user: 'system',
      ip: '127.0.0.1',
    },
    {
      id: 'LOG0012',
      timestamp: '2025-04-26 14:18:22',
      level: 'Info',
      category: 'User',
      message: 'User sam_smith account locked due to inactivity',
      user: 'system',
      ip: '127.0.0.1',
    },
    {
      id: 'LOG0013',
      timestamp: '2025-04-26 12:05:17',
      level: 'Info',
      category: 'VM',
      message: 'VM002 stopped by user',
      user: 'john_emp',
      ip: '192.168.1.45',
    },
    {
      id: 'LOG0014',
      timestamp: '2025-04-26 10:33:51',
      level: 'Error',
      category: 'System',
      message: 'Failed to apply system updates',
      user: 'system',
      ip: '127.0.0.1',
    },
    {
      id: 'LOG0015',
      timestamp: '2025-04-26 09:27:40',
      level: 'Critical',
      category: 'Security',
      message: 'Potential intrusion attempt detected',
      user: 'system',
      ip: '127.0.0.1',
    },
  ];
  
  return logs;
};

const LogsPage = () => {
  const { toast } = useToast();
  // Empty array for logs data
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [levelFilter, setLevelFilter] = useState<string>('All');

  const handleRefreshLogs = () => {
    toast({
      title: "Logs Refreshed",
      description: "The log entries have been updated.",
    });
    
    // In a real app, this would fetch new logs from the server
    // For now, we keep the empty array
    setLogs([]);
  };
  
  const handleDownloadLogs = () => {
    toast({
      title: "Logs Downloaded",
      description: "The log file has been prepared for download.",
    });
    
    // In a real app, this would generate and download a log file
  };

  // Filter logs based on search term and selected filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = categoryFilter === 'All' || log.category === categoryFilter;
    const matchesLevel = levelFilter === 'All' || log.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Get unique categories and levels for filter dropdowns
  const categories = ['All', ...Array.from(new Set(logs.map(log => log.category)))];
  const levels = ['All', ...Array.from(new Set(logs.map(log => log.level)))];
  
  // Get icon based on log level
  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'Critical':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'Error':
        return <AlertTriangle size={16} className="text-cyber-red" />;
      case 'Warning':
        return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'Info':
      default:
        return <Info size={16} className="text-cyber-blue" />;
    }
  };
  
  // Get icon based on log category
  const getCategoryIcon = (category: LogEntry['category']) => {
    switch (category) {
      case 'Security':
        return <AlertCircle size={16} className="text-cyber-red" />;
      case 'User':
        return <User size={16} className="text-cyber-green" />;
      case 'VM':
        return <Monitor size={16} className="text-purple-400" />;
      case 'Database':
        return <Database size={16} className="text-cyber-blue" />;
      case 'System':
      default:
        return <Server size={16} className="text-cyber-teal" />;
    }
  };

  return (
    <DashboardLayout>
      <Card className="glass-panel border-cyber-teal/30 mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-cyber-teal">System Logs</CardTitle>
            <CardDescription className="text-cyber-gray">
              View and analyze system activity logs
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue"
              onClick={handleRefreshLogs}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              className="border-cyber-teal/30 hover:bg-cyber-green/20 hover:text-cyber-green"
              onClick={handleDownloadLogs}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filter Controls */}
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-cyber-gray" />
                <Input
                  placeholder="Search logs..."
                  className="pl-8 border-cyber-teal/30"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div>
                <select
                  className="h-10 px-3 py-2 rounded-md border border-cyber-teal/30 bg-cyber-dark-blue/20 text-cyber-gray"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  className="h-10 px-3 py-2 rounded-md border border-cyber-teal/30 bg-cyber-dark-blue/20 text-cyber-gray"
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Logs Table */}
          <div className="rounded-md border border-cyber-teal/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-cyber-dark-blue/40">
                <TableRow>
                  <TableHead className="w-[100px] text-cyber-teal">ID</TableHead>
                  <TableHead className="w-[180px] text-cyber-teal">Timestamp</TableHead>
                  <TableHead className="w-[100px] text-cyber-teal">Level</TableHead>
                  <TableHead className="w-[120px] text-cyber-teal">Category</TableHead>
                  <TableHead className="text-cyber-teal">Message</TableHead>
                  <TableHead className="w-[120px] text-cyber-teal">User</TableHead>
                  <TableHead className="w-[120px] text-cyber-teal">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id} className={`hover:bg-cyber-dark-blue/20 ${
                      log.level === 'Critical' ? 'bg-cyber-red/10' :
                      log.level === 'Error' ? 'bg-cyber-red/5' :
                      log.level === 'Warning' ? 'bg-yellow-400/5' : ''
                    }`}>
                      <TableCell className="font-mono text-xs text-cyber-teal">{log.id}</TableCell>
                      <TableCell className="text-xs text-cyber-gray">{log.timestamp}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getLevelIcon(log.level)}
                          <span className={`text-xs ${
                            log.level === 'Critical' ? 'text-red-500' :
                            log.level === 'Error' ? 'text-cyber-red' :
                            log.level === 'Warning' ? 'text-yellow-400' :
                            'text-cyber-blue'
                          }`}>
                            {log.level}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(log.category)}
                          <span className="text-xs text-cyber-gray">{log.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-cyber-teal">{log.message}</TableCell>
                      <TableCell className="text-xs text-cyber-gray">{log.user}</TableCell>
                      <TableCell className="text-xs font-mono text-cyber-gray">{log.ip}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-cyber-gray">
                      No log entries match your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Log Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
              <div className="text-xs text-cyber-gray">Total Entries</div>
              <div className="text-xl text-cyber-teal mt-1">{logs.length}</div>
            </div>
            <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
              <div className="text-xs text-cyber-gray">Critical/Error</div>
              <div className="text-xl text-cyber-red mt-1">
                {logs.filter(log => log.level === 'Critical' || log.level === 'Error').length}
              </div>
            </div>
            <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
              <div className="text-xs text-cyber-gray">Today's Entries</div>
              <div className="text-xl text-cyber-blue mt-1">
                {logs.filter(log => log.timestamp.includes('2025-05-05')).length}
              </div>
            </div>
            <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
              <div className="text-xs text-cyber-gray">Security Events</div>
              <div className="text-xl text-cyber-green mt-1">
                {logs.filter(log => log.category === 'Security').length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default LogsPage;
