import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter, Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { isLoggedIn, getCurrentUser, updateUserInfo, logout } from '@shared/services/authService'

export default function AccountScreen() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState({ 
    username: '', 
    fullName: '',
    phone: '', 
    address: '' 
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLogin = async () => {
      // Dùng shared service
      const loggedIn = await isLoggedIn(AsyncStorage)
      if (!loggedIn) {
        router.replace('/login')
        return
      }

      const user = await getCurrentUser(AsyncStorage)
      if (user) setUserInfo(user)
      setLoading(false)
    }
    checkLogin()
  }, [])

  const handleSave = async () => {
    try {
      // Dùng shared service
      await updateUserInfo({
        username: userInfo.username,
        fullName: userInfo.fullName,
        phone: userInfo.phone,
        address: userInfo.address,
      }, AsyncStorage)
      Alert.alert('Thành công', 'Đã lưu thông tin!')
    } catch (error) {
      Alert.alert('Lỗi', error.message)
    }
  }

  const handleLogout = async () => {
    // Dùng shared service
    await logout(AsyncStorage)
    router.replace('/login')
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text>Đang tải...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Thông tin cá nhân</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên đầy đủ"
        value={userInfo.fullName || ''}
        onChangeText={v => setUserInfo({ ...userInfo, fullName: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={userInfo.phone || ''}
        onChangeText={v => setUserInfo({ ...userInfo, phone: v })}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ mặc định"
        value={userInfo.address || ''}
        onChangeText={v => setUserInfo({ ...userInfo, address: v })}
      />
      <Pressable style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>💾 Lưu thông tin</Text>
      </Pressable>

      <View style={{ marginTop: 32 }}>
        <Link href="/change-password" asChild>
          <Pressable style={styles.menuBtn}>
            <Text style={styles.menuText}>🔒 Đổi mật khẩu</Text>
          </Pressable>
        </Link>
        <Pressable style={styles.menuBtn} onPress={handleLogout}>
          <Text style={styles.menuText}>🚪 Đăng xuất</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: '#3dd9eaff' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  saveBtn: { backgroundColor: '#3dd9eaff', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 12 },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  menuBtn: { backgroundColor: '#eee', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 12 },
  menuText: { color: '#222', fontWeight: 'bold', fontSize: 16 },
})
