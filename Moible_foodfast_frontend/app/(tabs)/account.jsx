import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter, Link } from 'expo-router'

export default function AccountScreen() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState({ username: '', phone: '', address: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLogin = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn')
      if (!isLoggedIn) {
        router.replace('/login')   // chưa đăng nhập thì chuyển sang login
        return
      }

      const val = await AsyncStorage.getItem('userInfo')
      if (val) setUserInfo(JSON.parse(val))
      setLoading(false)
    }
    checkLogin()
  }, [])

  const handleSave = async () => {
    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
    alert('Đã lưu thông tin!')
  }

  if (loading) {
    return <View style={styles.container}><Text>Đang tải...</Text></View>
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
        <Link href="/change-password" asChild>
          <Pressable style={styles.menuBtn}>
            <Text style={styles.menuText}>Đổi mật khẩu</Text>
          </Pressable>
        </Link>
        <Pressable style={styles.menuBtn} onPress={async () => {
          await AsyncStorage.removeItem('isLoggedIn')
          await AsyncStorage.removeItem('userInfo')
          router.replace('/login')   // đăng xuất xong đưa về login
        }}>
          <Text style={styles.menuText}>Đăng xuất</Text>
        </Pressable>
      </View>
    </View>
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
