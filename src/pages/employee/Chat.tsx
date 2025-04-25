
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ChatPanel from '@/components/chat/ChatPanel';

const Chat = () => {
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-7rem)]">
        <ChatPanel />
      </div>
    </DashboardLayout>
  );
};

export default Chat;
