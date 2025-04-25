
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ChatPanel from '@/components/chat/ChatPanel';

const EmployeeChat = () => {
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)]">
        <ChatPanel />
      </div>
    </DashboardLayout>
  );
};

export default EmployeeChat;
