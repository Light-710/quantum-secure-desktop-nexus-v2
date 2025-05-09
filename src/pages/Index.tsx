
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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-orange-500">PTNG</h1>
        <p className="text-xl text-gray-500">Initializing secure connection...</p>
        <div className="mt-6">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-orange-500 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
