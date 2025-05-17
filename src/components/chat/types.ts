
import { UserRole } from '@/types/user';

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  senderRole: UserRole;
}
