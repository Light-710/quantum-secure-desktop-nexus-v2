
import React, { useState, useEffect } from 'react';
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

const LogsPage = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch logs
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would call an API endpoint
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setLogs([]);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const handleRefreshLogs = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      setLogs([]);
      toast({
        title: "Logs Refreshed",
        description: "The log entries have been updated.",
      });
    } catch (error) {
      console.error('Error refreshing logs:', error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
              variant="outline"
              className="border-cyber-teal/30 hover:bg-cyber-green/20 hover:text-cyber-green"
              onClick={handleDownloadLogs}
              disabled={isLoading}
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-cyber-gray">
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin h-6 w-6 border-2 border-cyber-teal border-t-transparent rounded-full mr-2"></div>
                        <span>Loading logs...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredLogs.length > 0 ? (
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
                {logs.filter(log => {
                  const today = new Date().toISOString().split('T')[0];
                  return log.timestamp.includes(today);
                }).length}
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
