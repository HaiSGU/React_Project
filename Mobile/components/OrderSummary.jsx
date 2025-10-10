import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import SectionCard from './SectionCard';
import colors from '../styles/colors';

export default function OrderSummary({ items = [], subtotal = 0, shippingFee = 0, discount = 0 }) {
  const total = Math.max(0, subtotal - discount + shippingFee);
  return (
    <SectionCard title="📦 Đơn hàng">
      <FlatList
        data={items}
        keyExtractor={(i, idx) => `${i?.id || idx}`}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {!!item?.image && <Image source={item.image} style={styles.thumb} />}
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.title || item.name} x{item.quantity}</Text>
              <Text style={styles.meta}>{(item.price * item.quantity).toLocaleString()} đ</Text>
            </View>
          </View>
        )}
      />
      <View style={styles.sep} />
      <View style={styles.sum}><Text>Tạm tính</Text><Text>{subtotal.toLocaleString()} đ</Text></View>
      <View style={styles.sum}><Text>Giảm giá</Text><Text>-{discount.toLocaleString()} đ</Text></View>
      <View style={styles.sum}><Text>Phí ship</Text><Text>{shippingFee.toLocaleString()} đ</Text></View>
      <View style={styles.total}><Text style={styles.totalL}>Tổng</Text><Text style={styles.totalV}>{total.toLocaleString()} đ</Text></View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  thumb: { width: 52, height: 40, borderRadius: 8, marginRight: 10 },
  name: { fontWeight: '600', color: '#222' },
  meta: { color: '#666', marginTop: 2 },
  sep: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  sum: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  total: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, borderTopWidth: 1, borderColor: '#f0f0f0' },
  totalL: { fontWeight: '700', fontSize: 16 },
  totalV: { fontWeight: '900', fontSize: 18, color: colors.primary },
});