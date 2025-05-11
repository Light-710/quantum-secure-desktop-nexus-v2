
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  // Redirect to login page
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate('/login');
    }, 1000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  // This will briefly show before redirect happens
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-primary">PTNG</h1>
        <p className="text-xl text-muted-foreground">Initializing secure connection...</p>
        <div className="mt-6">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-secondary border-t-primary mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
