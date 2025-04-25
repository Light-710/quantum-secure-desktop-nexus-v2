
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
import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";

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
            
            {/* Manager Routes */}
            <Route 
              path="/dashboard/manager" 
              element={
                <ProtectedRoute allowedRoles={['Manager']}>
                  <ManagerDashboard />
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
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
