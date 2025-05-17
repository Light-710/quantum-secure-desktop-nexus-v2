
import React from 'react';
import { AlertCircle, CheckCircle2, Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
}

const ConnectionStatus = ({ isConnected, isConnecting }: ConnectionStatusProps) => {
  if (isConnecting) {
    return (
      <div className="flex items-center text-xs text-warm-100/60 gap-1">
        <Wifi className="h-3 w-3 animate-pulse" />
        <span>Connecting...</span>
      </div>
    );
  }
  
  if (isConnected) {
    return (
      <div className="flex items-center text-xs text-green-500 gap-1">
        <CheckCircle2 className="h-3 w-3" />
        <span>Connected</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center text-xs text-warm-100/60 gap-1">
      <WifiOff className="h-3 w-3" />
      <span>Offline</span>
    </div>
  );
};

export default ConnectionStatus;
