
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  // Redirect to login page
  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  // This will briefly show before redirect happens
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-cyber-teal">PTNG</h1>
        <p className="text-xl text-cyber-gray">Initializing secure connection...</p>
      </div>
    </div>
  );
};

export default Index;
