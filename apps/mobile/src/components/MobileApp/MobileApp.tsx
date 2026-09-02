import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { mobileTokens } from '../../theme/tokens';

export const MobileApp: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FaceLine Mobile</Text>
      <Text style={styles.subtitle}>3D Avatar Chat App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTokens.colors.bgCanvasLight
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: mobileTokens.colors.primaryAzure
  },
  subtitle: {
    fontSize: 14,
    color: mobileTokens.colors.textMuted,
    marginTop: 8
  }
});
