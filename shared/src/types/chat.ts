export interface Conversation {
  id: string;
  isGroup: boolean;
  name?: string;
  createdAt: string;
}

export type ConversationRole = 'admin' | 'member';

export interface ConversationMember {
  conversationId: string;
  userId: string;
  role: ConversationRole;
  joinedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  ciphertext: string;
  olmMsgType: number;
  createdAt: string;
}

export interface AvatarMessage {
  id: string;
  conversationId: string;
  senderId: string;
  ciphertext: string;
  createdAt: string;
  expiresAt: string;
}

export type NotificationType = 'screenshot' | 'mention' | 'group_add';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  conversationId: string;
  actorName: string;
  read: boolean;
  createdAt: string;
}
