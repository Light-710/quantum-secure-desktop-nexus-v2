
import { AdminInitializer } from '@/components/admin/AdminInitializer';

const AdminSetup = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background effects */}
      <div className="cyber-grid-bg" />
      <div className="scan-line animate-scan-line" />
      
      {/* Logo */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <h1 className="text-4xl md:text-5xl neon-blue font-black tracking-wider">PTNG</h1>
      </div>
      
      <AdminInitializer />
    </div>
  );
};

export default AdminSetup;
