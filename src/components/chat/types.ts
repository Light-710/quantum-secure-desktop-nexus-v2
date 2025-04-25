
export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  senderRole: 'Employee' | 'Manager';
}
