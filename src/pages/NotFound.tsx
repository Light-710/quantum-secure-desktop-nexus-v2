
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      
      <div className="text-center glass-panel border-cyber-red/30 p-8 max-w-md relative overflow-hidden">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-cyber-red/10 flex items-center justify-center">
            <AlertTriangle size={48} className="text-cyber-red animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-6xl font-black mb-4 neon-red animate-pulse">404</h1>
        <p className="text-xl text-cyber-teal mb-6">Access Denied: Quantum Field Disruption</p>
        
        <Alert variant="destructive" className="mb-6 bg-cyber-dark-blue/50 border-cyber-red/30">
          <AlertDescription className="text-cyber-gray text-center">
            The neural pathway to the requested resource cannot be established. Return to a secure sector.
          </AlertDescription>
        </Alert>
        
        {/* Decorative circuit lines */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyber-red/30"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyber-red/30"></div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <Button className="cyber-button group w-full sm:w-auto">
              Return to Login
              <span className="ml-2 text-xs group-hover:text-cyber-red transition-colors">[secure]</span>
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="border-cyber-teal/30 hover:bg-cyber-teal/10 w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            Previous Location
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
