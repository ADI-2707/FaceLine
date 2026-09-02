export type GestureType = 'wave' | 'thumbs_up' | 'clap' | 'peace_sign' | 'point';

export type ExpressionType = 'neutral' | 'smile' | 'sarcastic_smirk' | 'surprise' | 'laugh';

export interface GestureEvent {
  conversationId: string;
  userId: string;
  gestureType: GestureType;
  expressionType?: ExpressionType;
  timestamp: number;
}

export interface ScreenshotEvent {
  conversationId: string;
  takenByUserId: string;
  takenByName: string;
  timestamp: number;
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}
