import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const steps = ['Chọn món', 'Địa chỉ', 'Thanh toán'];

export default function CheckoutStepper({ current = 2 }) {
  return (
    <View style={styles.row}>
      {steps.map((s, idx) => {
        const active = idx <= current;
        return (
          <View key={s} style={styles.stepWrap}>
            <View style={[styles.dot, active && styles.dotActive]} />
            <Text style={[styles.label, active && styles.labelActive]}>{s}</Text>
            {idx < steps.length - 1 && <View style={[styles.line, active && styles.lineActive]} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  stepWrap: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#d8d8d8' },
  dotActive: { backgroundColor: '#00b14f' },
  line: { height: 2, backgroundColor: '#e9e9e9', flex: 1, marginHorizontal: 6 },
  lineActive: { backgroundColor: '#00b14f' },
  label: { fontSize: 12, color: '#888', marginLeft: 6 },
  labelActive: { color: '#222', fontWeight: '600' },
});