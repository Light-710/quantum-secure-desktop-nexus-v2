
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Monitor, HardDrive, Power } from 'lucide-react';
import { ResourceUtilization } from './ResourceUtilization';
import { VMStatusBadge } from './VMStatusBadge';
import { VirtualMachine, handleVMAction, handleCreateSnapshot } from '@/services/vmManagementService';

interface VMDetailsDialogProps {
  vm: VirtualMachine | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  actionLoading: string | null;
}

export const VMDetailsDialog = ({ vm, isOpen, onOpenChange, actionLoading }: VMDetailsDialogProps) => {
  if (!vm) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-cyber-teal/30 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-cyber-teal">Virtual Desktop Details</DialogTitle>
          <DialogDescription className="text-cyber-gray">
            {vm.name} ({vm.id})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* OS Info */}
            <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
              <div className="text-xs text-cyber-gray">Operating System</div>
              <div className={`text-sm mt-1 ${
                vm.os === 'Windows' ? 'text-blue-400' : 
                vm.os === 'Linux' ? 'text-yellow-400' : 
                'text-purple-400'
              }`}>
                {vm.os}
              </div>
            </div>
            
            {/* Status */}
            <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
              <div className="text-xs text-cyber-gray">Status</div>
              <div className="mt-1">
                <VMStatusBadge status={vm.status} />
              </div>
            </div>

            {/* Other Info Fields */}
            <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
              <div className="text-xs text-cyber-gray">Assigned User</div>
              <div className="text-sm text-cyber-teal mt-1">{vm.assigned_user}</div>
            </div>

            <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
              <div className="text-xs text-cyber-gray">IP Address</div>
              <div className="text-sm text-cyber-teal mt-1">{vm.ip_address}</div>
            </div>

            <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
              <div className="text-xs text-cyber-gray">Uptime</div>
              <div className="text-sm text-cyber-teal mt-1">{vm.uptime}</div>
            </div>

            <div className="p-3 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
              <div className="text-xs text-cyber-gray">Health</div>
              <div className={`text-sm mt-1 ${
                vm.health === 'Good' ? 'text-green-400' : 
                vm.health === 'Fair' ? 'text-yellow-400' :
                'text-cyber-red'
              }`}>
                {vm.health}
              </div>
            </div>
          </div>

          {/* Resources Section */}
          <div className="p-4 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
            <div className="text-sm text-cyber-teal mb-3">Resource Utilization</div>
            <div className="space-y-3">
              <ResourceUtilization label="CPU" value={vm.resources.cpu} color="cyber-blue" />
              <ResourceUtilization label="Memory" value={vm.resources.memory} color="cyber-green" />
              <ResourceUtilization label="Disk" value={vm.resources.disk} color="cyber-teal" />
              <ResourceUtilization label="Network" value={vm.resources.network} color="purple-400" />
            </div>
          </div>

          {/* Snapshot Section */}
          <div className="p-4 border border-cyber-teal/20 rounded-md bg-cyber-dark-blue/20">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-cyber-teal">Snapshot</div>
                <div className="text-xs text-cyber-gray mt-1">Last: {vm.last_snapshot}</div>
              </div>
              <Button 
                variant="outline"
                size="sm"
                className="border-cyber-teal/30 hover:bg-cyber-blue/20 hover:text-cyber-blue"
                onClick={() => handleCreateSnapshot(vm.id)}
                disabled={actionLoading === vm.id}
              >
                {actionLoading === vm.id ? (
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <HardDrive className="mr-2 h-4 w-4" />
                )}
                Create Snapshot
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            {vm.status === 'Running' ? (
              <>
                <Button
                  variant="outline"
                  className="border-cyber-teal/30 hover:bg-cyber-red/20 hover:text-cyber-red"
                  onClick={() => handleVMAction(vm.id, 'Stop', vm.os.toLowerCase(), vm.assigned_user)}
                  disabled={actionLoading === vm.id}
                >
                  {actionLoading === vm.id ? (
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Power className="mr-2 h-4 w-4" />
                  )}
                  Stop
                </Button>
                <Button className="cyber-button">
                  <Monitor className="mr-2 h-4 w-4" />
                  Connect
                </Button>
              </>
            ) : vm.status === 'Paused' || vm.status === 'Stopped' ? (
              <Button
                className="cyber-button"
                onClick={() => handleVMAction(vm.id, vm.status === 'Paused' ? 'Resume' : 'Start', vm.os.toLowerCase(), vm.assigned_user)}
                disabled={actionLoading === vm.id}
              >
                {actionLoading === vm.id ? (
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <polygon points="5,3 19,12 5,21" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                  </svg>
                )}
                {vm.status === 'Paused' ? 'Resume' : 'Start'}
              </Button>
            ) : (
              <Button
                className="cyber-button"
                onClick={() => handleVMAction(vm.id, 'Start', vm.os.toLowerCase(), vm.assigned_user)}
                disabled={actionLoading === vm.id}
              >
                {actionLoading === vm.id ? (
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <polygon points="5,3 19,12 5,21" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                  </svg>
                )}
                Start
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
