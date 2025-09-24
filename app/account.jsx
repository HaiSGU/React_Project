import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter, Link } from 'expo-router'

export default function AccountScreen() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState({ username: '', phone: '', address: '' })

  useEffect(() => {
    AsyncStorage.getItem('userInfo').then(val => {
      if (val) setUserInfo(JSON.parse(val))
    })
  }, [])

  const handleSave = async () => {
    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
    alert('Đã lưu thông tin!')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin cá nhân</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên"
        value={userInfo.username}
        onChangeText={v => setUserInfo({ ...userInfo, username: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={userInfo.phone}
        onChangeText={v => setUserInfo({ ...userInfo, phone: v })}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ mặc định"
        value={userInfo.address}
        onChangeText={v => setUserInfo({ ...userInfo, address: v })}
      />
      <Pressable style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Lưu</Text>
      </Pressable>

      <View style={{ marginTop: 32 }}>
        <Link href="/cart" asChild>
          <Pressable style={styles.menuBtn}>
            <Text style={styles.menuText}>Giỏ hàng</Text>
          </Pressable>
        </Link>
        <Link href="/change-password" asChild>
          <Pressable style={styles.menuBtn}>
            <Text style={styles.menuText}>Đổi mật khẩu</Text>
          </Pressable>
        </Link>
        <Pressable style={styles.menuBtn} onPress={() => {
          AsyncStorage.removeItem('isLoggedIn')
          AsyncStorage.removeItem('userInfo')
          router.replace('/')
        }}>
          <Text style={styles.menuText}>Đăng xuất</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: '#00b14f' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  saveBtn: { backgroundColor: '#00b14f', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 12 },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  menuBtn: { backgroundColor: '#eee', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 12 },
  menuText: { color: '#222', fontWeight: 'bold', fontSize: 16 },
})