import React, { useState } from 'react';
import styles from './NewChatModal.module.css';

export interface NewChatModalProps {
  onCreateChat: (data: { isGroup: boolean; name?: string; recipientEmail?: string }) => void;
  onClose: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ onCreateChat, onClose }) => {
  const [isGroup, setIsGroup] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');

  const handleCreate = () => {
    onCreateChat({
      isGroup,
      name: isGroup ? name : undefined,
      recipientEmail: !isGroup ? recipientEmail : undefined
    });
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Start New Conversation</h2>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.modeToggle}>
          <button
            type="button"
            className={`${styles.modeBtn} ${!isGroup ? styles.activeMode : ''}`}
            onClick={() => setIsGroup(false)}
          >
            1:1 Direct Message
          </button>
          <button
            type="button"
            className={`${styles.modeBtn} ${isGroup ? styles.activeMode : ''}`}
            onClick={() => setIsGroup(true)}
          >
            Group Room
          </button>
        </div>

        {isGroup ? (
          <div className={styles.inputGroup}>
            <label className={styles.label}>Group Room Name</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. Design Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        ) : (
          <div className={styles.inputGroup}>
            <label className={styles.label}>Recipient User Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="user@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </div>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.createBtn} onClick={handleCreate}>
            Start Encrypted Chat
          </button>
        </div>
      </div>
    </div>
  );
};
