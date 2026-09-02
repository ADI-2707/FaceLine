import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export interface MobileGestureDockProps {
  onTriggerGesture: (gesture: string, expression?: string) => void;
}

export const MobileGestureDock: React.FC<MobileGestureDockProps> = ({ onTriggerGesture }) => {
  const gestures = [
    { label: 'Wave', icon: '👋', type: 'wave', expr: 'smile' },
    { label: 'Thumbs Up', icon: '👍', type: 'thumbs_up', expr: 'smile' },
    { label: 'Clap', icon: '👏', type: 'clap', expr: 'laugh' },
    { label: 'Peace', icon: '✌️', type: 'peace_sign', expr: 'sarcastic_smirk' },
    { label: 'Point', icon: '👉', type: 'point', expr: 'surprise' }
  ];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {gestures.map((g) => (
          <TouchableOpacity
            key={g.type}
            style={styles.pill}
            onPress={() => onTriggerGesture(g.type, g.expr)}
          >
            <Text style={styles.icon}>{g.icon}</Text>
            <Text style={styles.label}>{g.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    paddingVertical: 8
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 8
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6
  },
  icon: {
    fontSize: 14
  },
  label: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600'
  }
});
