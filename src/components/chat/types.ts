
import { UserRole } from '@/types/user';

export interface Message {
  id: string | number;
  sender: string;
  content: string;
  timestamp: Date;
  senderRole: UserRole;
  is_file?: boolean;
  file_path?: string;
}

export interface ApiMessage {
  id?: number;
  message_id?: string;
  sender_id?: string | number;
  sender_name: string;
  sender_role?: string;
  content: string;
  timestamp: string;
  is_file?: boolean;
  file_path?: string;
}

export interface ApiMessageResponse {
  messages: ApiMessage[];
}
