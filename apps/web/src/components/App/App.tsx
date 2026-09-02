import React, { useState, useEffect } from 'react';
import { AuthPage } from '../../pages/AuthPage/AuthPage.js';
import { Sidebar } from '../Sidebar/Sidebar.js';
import { ConversationList, ConversationItem } from '../ConversationList/ConversationList.js';
import { AvatarHeader } from '../AvatarHeader/AvatarHeader.js';
import { ChatView, ChatMessage } from '../ChatView/ChatView.js';
import { GestureDock } from '../GestureDock/GestureDock.js';
import { AvatarCreator } from '../AvatarCreator/AvatarCreator.js';
import { NewChatModal } from '../NewChatModal/NewChatModal.js';
import { FilePicker } from '../FilePicker/FilePicker.js';
import { ScreenshotToast } from '../ScreenshotToast/ScreenshotToast.js';
import { ExpressionType } from '../AvatarCanvas/expressionController.js';
import { GestureType } from '../AvatarCanvas/gestureController.js';
import styles from './App.module.css';

export const App: React.FC = () => {
  const [user, setUser] = useState<{ id: string; name: string; email: string; avatarGlbUrl?: string } | null>(null);
  const [isDark, setIsDark] = useState<boolean>(true);

  const [conversations, setConversations] = useState<ConversationItem[]>([
    {
      id: 'conv_1',
      name: 'Sarah Connor (3D Avatar)',
      lastMessage: 'Check out my new avatar expression!',
      updatedAt: '10:42 AM',
      unreadCount: 1,
      isOnline: true
    },
    {
      id: 'conv_2',
      name: 'E2EE Group Chat',
      isGroup: true,
      lastMessage: 'Meeting scheduled for 3PM',
      updatedAt: 'Yesterday',
      unreadCount: 0,
      isOnline: true
    }
  ]);

  const [activeConversationId, setActiveConversationId] = useState<string>('conv_1');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      senderId: 'user_peer',
      ciphertext: 'Hello! Welcome to FaceLine 3D Avatar Chat!',
      createdAt: '10:40 AM',
      isEphemeral: false
    },
    {
      id: 'm2',
      senderId: 'user_peer',
      ciphertext: 'This message will self-destruct in 24 hours ⌛',
      createdAt: '10:42 AM',
      isEphemeral: true
    }
  ]);

  const [peerExpression, setPeerExpression] = useState<ExpressionType>('smile');
  const [peerGesture, setPeerGesture] = useState<GestureType | undefined>('wave');

  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
  const [showFilePickerModal, setShowFilePickerModal] = useState<boolean>(false);
  const [screenshotAlert, setScreenshotAlert] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  if (!user) {
    return <AuthPage onAuthSuccess={(u) => setUser({ ...u, id: 'user_current' })} />;
  }

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  const handleSendMessage = (text: string, isEphemeral: boolean) => {
    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: user.id,
      ciphertext: text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEphemeral
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleTriggerGesture = (gesture: GestureType, expression?: ExpressionType) => {
    setPeerGesture(gesture);
    if (expression) setPeerExpression(expression);
  };

  const handleCreateChat = (data: { isGroup: boolean; name?: string; recipientEmail?: string }) => {
    const newConv: ConversationItem = {
      id: 'conv_' + Date.now(),
      name: data.isGroup ? data.name || 'New Group' : data.recipientEmail?.split('@')[0] || 'Direct Message',
      isGroup: data.isGroup,
      lastMessage: 'Conversation created',
      updatedAt: 'Just now',
      isOnline: true
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
  };

  const handleSendEncryptedFile = (descriptor: { fileName: string; aesKeyBase64: string; ivBase64: string }) => {
    handleSendMessage(`📎 [Encrypted File]: ${descriptor.fileName} (AES-256-GCM)`, false);
  };

  return (
    <div className={styles.appLayout}>
      <Sidebar
        user={user}
        onOpenNewChat={() => setShowNewChatModal(true)}
        onOpenAvatarCustomizer={() => setShowAvatarModal(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      >
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
        />
      </Sidebar>

      <main className={styles.mainArea}>
        {activeConv ? (
          <>
            <AvatarHeader
              peerName={activeConv.name || 'Chat Participant'}
              peerExpression={peerExpression}
              peerGesture={peerGesture}
              isOnline={activeConv.isOnline}
            />
            <ChatView
              messages={messages}
              currentUserId={user.id}
              onSendMessage={handleSendMessage}
              onOpenFilePicker={() => setShowFilePickerModal(true)}
            />
            <div className={styles.dockWrapper}>
              <GestureDock onTriggerGesture={handleTriggerGesture} />
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🎭</span>
            <h3>Select a Conversation</h3>
            <p>Start end-to-end encrypted 3D avatar chatting</p>
          </div>
        )}
      </main>

      {screenshotAlert && (
        <ScreenshotToast
          takenByName={screenshotAlert}
          onClose={() => setScreenshotAlert(null)}
        />
      )}

      {showAvatarModal && (
        <AvatarCreator
          currentGlbUrl={user.avatarGlbUrl}
          onSave={(url) => setUser({ ...user, avatarGlbUrl: url })}
          onClose={() => setShowAvatarModal(false)}
        />
      )}

      {showNewChatModal && (
        <NewChatModal
          onCreateChat={handleCreateChat}
          onClose={() => setShowNewChatModal(false)}
        />
      )}

      {showFilePickerModal && (
        <FilePicker
          onSendEncryptedFile={handleSendEncryptedFile}
          onClose={() => setShowFilePickerModal(false)}
        />
      )}
    </div>
  );
};
