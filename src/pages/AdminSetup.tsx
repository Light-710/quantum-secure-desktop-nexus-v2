
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminInitializer } from '@/components/admin/AdminInitializer';
import { toast } from '@/components/ui/sonner';

const AdminSetup = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [adminExists, setAdminExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin already exists to prevent creating multiple admins
    const checkAdminExists = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/check-admin-exists`);
        const data = await response.json();
        
        if (data.adminExists) {
          setAdminExists(true);
          toast.error("Admin already exists", {
            description: "An admin user has already been created. Please use the login page.",
          });
          // Redirect to login after a short delay
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        // If the endpoint doesn't exist yet or server is not running, just continue
        console.log("Could not check if admin exists:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminExists();
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background effects */}
      <div className="cyber-grid-bg" />
      <div className="scan-line animate-scan-line" />
      
      {/* Logo */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <h1 className="text-4xl md:text-5xl neon-blue font-black tracking-wider">PTNG</h1>
      </div>
      
      {isChecking ? (
        <div className="glass-panel border-cyber-teal/30 p-8 text-center">
          <div className="animate-pulse text-cyber-teal text-xl">Checking system status...</div>
        </div>
      ) : adminExists ? (
        <div className="glass-panel border-cyber-teal/30 p-8 text-center">
          <h2 className="text-xl text-cyber-teal mb-4">Admin Already Exists</h2>
          <p className="text-cyber-gray mb-4">
            An admin user has already been created for this system. 
            You will be redirected to the login page.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="cyber-button"
          >
            Go to Login
          </button>
        </div>
      ) : (
        <AdminInitializer />
      )}
    </div>
  );
};

export default AdminSetup;
