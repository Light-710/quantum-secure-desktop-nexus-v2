
import { UserRole } from '@/types/user';

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  senderRole: UserRole;
}

export interface ApiMessage {
  message_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  content: string;
  timestamp: string;
}

export interface ApiMessageResponse {
  messages: ApiMessage[];
}
