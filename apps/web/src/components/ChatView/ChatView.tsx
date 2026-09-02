import React, { useState } from 'react';
import styles from './ChatView.module.css';

export interface ChatMessage {
  id: string;
  senderId: string;
  ciphertext: string;
  createdAt: string;
  isEphemeral?: boolean;
}

export interface ChatViewProps {
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (text: string, isEphemeral: boolean) => void;
  onOpenFilePicker: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  currentUserId,
  onSendMessage,
  onOpenFilePicker
}) => {
  const [mode, setMode] = useState<'persistent' | 'ephemeral'>('persistent');
  const [inputText, setInputText] = useState<string>('');

  const filteredMessages = messages.filter((m) =>
    mode === 'ephemeral' ? Boolean(m.isEphemeral) : !m.isEphemeral
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), mode === 'ephemeral');
    setInputText('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.modeBar}>
        <button
          type="button"
          className={`${styles.modeToggle} ${mode === 'persistent' ? styles.activeMode : ''}`}
          onClick={() => setMode('persistent')}
        >
          🔒 Persistent E2EE Feed
        </button>
        <button
          type="button"
          className={`${styles.modeToggle} ${mode === 'ephemeral' ? styles.activeMode : ''}`}
          onClick={() => setMode('ephemeral')}
        >
          ⌛ 24h Ephemeral Avatar Feed
        </button>
      </div>

      <div className={styles.feed}>
        {filteredMessages.map((msg) => {
          const isSent = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`${styles.msgRow} ${isSent ? styles.sent : styles.received}`}
            >
              <div className={styles.bubble}>{msg.ciphertext}</div>
              <div className={styles.meta}>
                <span>🔒 E2EE</span>
                <span>•</span>
                <span>{msg.createdAt}</span>
              </div>
            </div>
          );
        })}
      </div>

      <form className={styles.inputBar} onSubmit={handleSend}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onOpenFilePicker}
          title="Attach Encrypted File"
          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          📎
        </button>
        <input
          type="text"
          className={styles.textInput}
          placeholder={mode === 'ephemeral' ? 'Send 24h ephemeral avatar message...' : 'Send end-to-end encrypted message...'}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" className={styles.iconBtn} title="Send Message">
          ➤
        </button>
      </form>
    </div>
  );
};
