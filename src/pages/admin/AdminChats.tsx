
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AdminChatPanel from '@/components/admin/AdminChatPanel';

const AdminChats = () => {
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-warm-300">Project Communications</h1>
          <p className="text-warm-200 mt-2">
            Monitor and manage all project communications from this dashboard.
          </p>
        </div>
        <AdminChatPanel />
      </div>
    </DashboardLayout>
  );
};

export default AdminChats;
