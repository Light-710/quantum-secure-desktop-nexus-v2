
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background effects */}
      <div className="cyber-grid-bg" />
      <div className="scan-line animate-scan-line" />
      
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-cyber-red/10 flex items-center justify-center animate-pulse">
            <AlertTriangle size={40} className="text-cyber-red" />
          </div>
        </div>
        
        <h1 className="text-5xl font-black mb-4 neon-red">404</h1>
        <p className="text-xl text-cyber-teal mb-6">Access Denied: Quantum Field Disruption</p>
        <p className="text-cyber-gray mb-8">
          The neural pathway to the requested resource cannot be established. Return to a secure sector.
        </p>
        
        <Link to="/login">
          <Button className="cyber-button">
            Return to Secure Zone
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
