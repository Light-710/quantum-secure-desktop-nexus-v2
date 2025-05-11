
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
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="text-center light-panel p-8 max-w-md relative overflow-hidden bg-[#FCFAF7] border-[#D6D2C9]">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-[#A84332]/10 flex items-center justify-center">
            <AlertTriangle size={48} className="text-[#A84332] animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-6xl font-black mb-4 text-[#C47D5F] animate-pulse">404</h1>
        <p className="text-xl text-[#C47D5F] mb-6">Access Denied: Resource Not Found</p>
        
        <Alert variant="destructive" className="mb-6 bg-[#A84332]/10 border-[#A84332]/30">
          <AlertDescription className="text-center text-[#5F5D58]">
            The requested resource cannot be found. Please return to a secure area.
          </AlertDescription>
        </Alert>
        
        {/* Decorative border elements */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C47D5F]/30"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C47D5F]/30"></div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <Button className="bg-[#C47D5F] hover:bg-[#C47D5F]/90 text-white group w-full sm:w-auto">
              Return to Login
              <span className="ml-2 text-xs group-hover:text-white/80 transition-colors">[secure]</span>
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="border-[#C47D5F]/30 hover:bg-[#C47D5F]/10 text-[#5F5D58] w-full sm:w-auto"
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
