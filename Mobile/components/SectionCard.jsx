import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SectionCard({ title, right, children, style }) {
  return (
    <View style={[styles.card, style]}>
      {!!title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {right}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginVertical: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontWeight: '700', fontSize: 16, color: '#222' },
});