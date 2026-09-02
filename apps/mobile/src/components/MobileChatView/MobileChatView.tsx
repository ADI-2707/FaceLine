import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export interface MobileChatMessage {
  id: string;
  senderId: string;
  ciphertext: string;
  createdAt: string;
  isEphemeral?: boolean;
}

export interface MobileChatViewProps {
  messages: MobileChatMessage[];
  currentUserId: string;
  onSendMessage: (text: string, isEphemeral: boolean) => void;
}

export const MobileChatView: React.FC<MobileChatViewProps> = ({
  messages,
  currentUserId,
  onSendMessage
}) => {
  const [mode, setMode] = useState<'persistent' | 'ephemeral'>('persistent');
  const [inputText, setInputText] = useState<string>('');

  const filteredMessages = messages.filter((m) =>
    mode === 'ephemeral' ? Boolean(m.isEphemeral) : !m.isEphemeral
  );

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), mode === 'ephemeral');
    setInputText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.modeBar}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'persistent' && styles.activeModeBtn]}
          onPress={() => setMode('persistent')}
        >
          <Text style={[styles.modeText, mode === 'persistent' && styles.activeModeText]}>
            🔒 E2EE Feed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'ephemeral' && styles.activeModeBtn]}
          onPress={() => setMode('ephemeral')}
        >
          <Text style={[styles.modeText, mode === 'ephemeral' && styles.activeModeText]}>
            ⌛ 24h Feed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.feed} contentContainerStyle={styles.feedContent}>
        {filteredMessages.map((msg) => {
          const isSent = msg.senderId === currentUserId;
          return (
            <View
              key={msg.id}
              style={[styles.msgBubble, isSent ? styles.sentBubble : styles.receivedBubble]}
            >
              <Text style={styles.msgText}>{msg.ciphertext}</Text>
              <Text style={styles.msgTime}>{msg.createdAt}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder={mode === 'ephemeral' ? 'Send 24h ephemeral message...' : 'Send E2EE message...'}
          placeholderTextColor="#94a3b8"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  modeBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    gap: 8
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  activeModeBtn: {
    backgroundColor: '#2563eb'
  },
  modeText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600'
  },
  activeModeText: {
    color: '#ffffff'
  },
  feed: {
    flex: 1
  },
  feedContent: {
    padding: 16,
    gap: 12
  },
  msgBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16
  },
  sentBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 2
  },
  receivedBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 2
  },
  msgText: {
    color: '#ffffff',
    fontSize: 14
  },
  msgTime: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right'
  },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    gap: 8
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0f172a',
    color: '#ffffff',
    paddingHorizontal: 16,
    fontSize: 14
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendBtnText: {
    color: '#ffffff',
    fontSize: 16
  }
});
