
import { io, Socket } from 'socket.io-client';
import { toast } from '@/components/ui/sonner';

interface SocketServiceOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (message: any) => void;
  onError?: (error: any) => void;
  onTyping?: (data: { user: string }) => void;
  onStopTyping?: (data: { user: string }) => void;
}

class SocketService {
  private socket: Socket | null = null;
  private options: SocketServiceOptions = {};

  constructor() {
    this.socket = null;
  }

  connect(token: string, options: SocketServiceOptions = {}) {
    if (this.socket && this.socket.connected) {
      console.log('Socket already connected');
      return;
    }

    this.options = options;
    
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    this.socket = io(baseURL, {
      auth: {
        token
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000
    });

    this.registerEvents();

    return this.socket;
  }

  private registerEvents() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
      if (this.options.onConnect) {
        this.options.onConnect();
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      if (this.options.onDisconnect) {
        this.options.onDisconnect();
      }
    });

    this.socket.on('message', (data) => {
      console.log('Message received', data);
      if (this.options.onMessage) {
        this.options.onMessage(data);
      }
    });

    this.socket.on('typing', (data) => {
      if (this.options.onTyping) {
        this.options.onTyping(data);
      }
    });

    this.socket.on('stop_typing', (data) => {
      if (this.options.onStopTyping) {
        this.options.onStopTyping(data);
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error', error);
      if (this.options.onError) {
        this.options.onError(error);
      } else {
        toast.error('Connection Error', {
          description: 'Failed to connect to chat server'
        });
      }
    });
  }

  joinRoom(projectId: string) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }

    console.log(`Joining room for project ${projectId}`);
    this.socket.emit('join', { projectId });
  }

  leaveRoom(projectId: string) {
    if (!this.socket) return;
    
    console.log(`Leaving room for project ${projectId}`);
    this.socket.emit('leave', { projectId });
  }

  sendMessage(projectId: string, content: string) {
    if (!this.socket) {
      console.error('Socket not connected');
      return false;
    }

    console.log(`Sending message to project ${projectId}`);
    this.socket.emit('message', { projectId, content });
    return true;
  }

  sendTypingStart(projectId: string) {
    if (!this.socket) return;
    
    this.socket.emit('typing', { projectId });
  }
  
  sendTypingStop(projectId: string) {
    if (!this.socket) return;
    
    this.socket.emit('stop_typing', { projectId });
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
