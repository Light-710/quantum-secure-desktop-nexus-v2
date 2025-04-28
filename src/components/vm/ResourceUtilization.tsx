
import React from 'react';

interface ResourceUtilizationProps {
  label: string;
  value: number;
  color: string;
}

export const ResourceUtilization = ({ label, value, color }: ResourceUtilizationProps) => (
  <div>
    <div className="flex justify-between text-xs">
      <span className="text-cyber-gray">{label}</span>
      <span className={`text-${color}`}>{value}%</span>
    </div>
    <div className="mt-1 h-2 bg-cyber-dark-blue rounded overflow-hidden">
      <div 
        className={`h-full bg-${color}`} 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);
