import React from 'react';
import styles from './Sidebar.module.css';

export interface SidebarProps {
  user: { name: string; email: string };
  onOpenNewChat: () => void;
  onOpenAvatarCustomizer: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  onOpenNewChat,
  onOpenAvatarCustomizer,
  isDark,
  onToggleTheme,
  children
}) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logoArea}>
          <span className={styles.logoText}>FaceLine</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={styles.actionIconBtn}
            onClick={onToggleTheme}
            title="Toggle Theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            type="button"
            className={styles.actionIconBtn}
            onClick={onOpenNewChat}
            title="New Chat"
          >
            ➕
          </button>
        </div>
      </div>

      <div className={styles.userBadge}>
        <div className={styles.userAvatar}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user.name}</div>
          <div className={styles.userStatus}>● Online</div>
        </div>
        <button
          type="button"
          className={styles.actionIconBtn}
          onClick={onOpenAvatarCustomizer}
          title="Edit 3D Avatar"
        >
          🎭
        </button>
      </div>

      <div className={styles.content}>
        {children}
      </div>
    </aside>
  );
};
