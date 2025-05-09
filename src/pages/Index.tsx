
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
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-cyber-teal">PTNG Security</h1>
        <p className="text-xl text-cyber-gray">Initializing secure connection...</p>
        <div className="mt-6">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-cyber-teal border-t-transparent mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
