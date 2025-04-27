
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Auth pages
import Login from "@/pages/Login";
import Contact from "@/pages/Contact";
import ForgotPassword from "@/pages/ForgotPassword";

// Dashboard pages
import EmployeeDashboard from "@/pages/employee/EmployeeDashboard";
import EmployeeChat from "@/pages/employee/EmployeeChat";
import EmployeeVirtualDesktop from "@/pages/employee/EmployeeVirtualDesktop";
import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import ManagerProjects from "@/pages/manager/ManagerProjects";
import ManagerTeam from "@/pages/manager/ManagerTeam";
import ManagerChat from "@/pages/manager/ManagerChat";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UsersPage from "@/pages/admin/UsersPage";
import SystemPage from "@/pages/admin/SystemPage";
import LogsPage from "@/pages/admin/LogsPage";
import VirtualDesktopPage from "@/pages/admin/VirtualDesktopPage";

// Error page
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Employee Routes */}
            <Route 
              path="/dashboard/employee" 
              element={
                <ProtectedRoute allowedRoles={['Employee']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/employee/chat" 
              element={
                <ProtectedRoute allowedRoles={['Employee']}>
                  <EmployeeChat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/employee/desktop" 
              element={
                <ProtectedRoute allowedRoles={['Employee']}>
                  <EmployeeVirtualDesktop />
                </ProtectedRoute>
              } 
            />
            
            {/* Manager Routes */}
            <Route 
              path="/dashboard/manager" 
              element={
                <ProtectedRoute allowedRoles={['Manager']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/manager/projects" 
              element={
                <ProtectedRoute allowedRoles={['Manager']}>
                  <ManagerProjects />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/manager/team" 
              element={
                <ProtectedRoute allowedRoles={['Manager']}>
                  <ManagerTeam />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/manager/chat" 
              element={
                <ProtectedRoute allowedRoles={['Manager']}>
                  <ManagerChat />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/dashboard/admin" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/admin/users" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <UsersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/admin/system" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <SystemPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/admin/logs" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <LogsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/admin/virtual-desktops" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <VirtualDesktopPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
