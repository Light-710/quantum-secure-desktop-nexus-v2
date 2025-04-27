
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ChatPanel from '@/components/chat/ChatPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
              {/* Team management content will be added here */}
              <div className="text-warm-100/70">Team management content coming soon</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Chat Panel */}
        <div className="h-[calc(100vh-8rem)] sticky top-24">
          <ChatPanel />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerTeam;
