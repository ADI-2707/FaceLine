import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Text } from 'react-native';
import { MobileAvatarView } from '../MobileAvatarView/MobileAvatarView';
import { MobileChatView, MobileChatMessage } from '../MobileChatView/MobileChatView';
import { MobileGestureDock } from '../MobileGestureDock/MobileGestureDock';
import { enableScreenProtection, listenForScreenshots } from '../../services/screenProtection';

export const MobileApp: React.FC = () => {
  const [messages, setMessages] = useState<MobileChatMessage[]>([
    {
      id: 'm1',
      senderId: 'peer_user',
      ciphertext: 'Welcome to FaceLine Mobile 3D Avatar Chat!',
      createdAt: '10:40 AM',
      isEphemeral: false
    },
    {
      id: 'm2',
      senderId: 'peer_user',
      ciphertext: '24h self-destructing avatar message ⌛',
      createdAt: '10:42 AM',
      isEphemeral: true
    }
  ]);

  const [peerGesture, setPeerGesture] = useState<string | undefined>('wave');
  const [peerExpression, setPeerExpression] = useState<string>('smile');
  const [screenshotAlert, setScreenshotAlert] = useState<boolean>(false);

  useEffect(() => {
    enableScreenProtection();
    const unsubscribe = listenForScreenshots(() => {
      setScreenshotAlert(true);
      setTimeout(() => setScreenshotAlert(false), 4000);
    });
    return () => unsubscribe();
  }, []);

  const handleSendMessage = (text: string, isEphemeral: boolean) => {
    const newMsg: MobileChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: 'current_user',
      ciphertext: text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEphemeral
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleTriggerGesture = (gesture: string, expression?: string) => {
    setPeerGesture(gesture);
    if (expression) setPeerExpression(expression);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {screenshotAlert && (
        <View style={styles.alertToast}>
          <Text style={styles.alertText}>📸 Screenshot Detected!</Text>
        </View>
      )}

      <MobileAvatarView
        peerName="Sarah Connor"
        expression={peerExpression}
        gesture={peerGesture}
      />

      <MobileChatView
        messages={messages}
        currentUserId="current_user"
        onSendMessage={handleSendMessage}
      />

      <MobileGestureDock onTriggerGesture={handleTriggerGesture} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  alertToast: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 100,
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  alertText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14
  }
});
