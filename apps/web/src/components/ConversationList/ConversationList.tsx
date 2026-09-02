import React, { useState } from 'react';
import styles from './ConversationList.module.css';

export interface ConversationItem {
  id: string;
  name?: string;
  isGroup?: boolean;
  lastMessage?: string;
  updatedAt?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

export interface ConversationListProps {
  conversations: ConversationItem[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation
}) => {
  const [search, setSearch] = useState<string>('');

  const filtered = conversations.filter((c) =>
    (c.name || 'Chat').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.searchBox}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.list}>
        {filtered.map((conv) => {
          const isActive = conv.id === activeConversationId;
          const name = conv.name || (conv.isGroup ? 'Group Chat' : 'Encrypted Chat');
          const initial = name.charAt(0).toUpperCase();

          return (
            <div
              key={conv.id}
              className={`${styles.item} ${isActive ? styles.activeItem : ''}`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className={styles.avatar}>
                {initial}
                {conv.isOnline && <span className={styles.onlineDot} />}
              </div>

              <div className={styles.details}>
                <div className={styles.topRow}>
                  <span className={styles.name}>{name}</span>
                  {conv.updatedAt && <span className={styles.time}>{conv.updatedAt}</span>}
                </div>
                <div className={styles.lastMsg}>
                  {conv.lastMessage || '🔒 End-to-end encrypted'}
                </div>
              </div>

              {Boolean(conv.unreadCount && conv.unreadCount > 0) && (
                <div className={styles.unreadBadge}>{conv.unreadCount}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
