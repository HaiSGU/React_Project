import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { login } from '@shared/services/authService'

export default function LoginScreen() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { cart, location, redirect } = useLocalSearchParams();

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert('Lỗi đăng nhập', 'Vui lòng nhập tên đăng nhập!')
      return
    }
    if (!password.trim()) {
      Alert.alert('Lỗi đăng nhập', 'Vui lòng nhập mật khẩu!')
      return
    }

    // Demo: kiểm tra tài khoản mẫu
    if (username === 'user' && password === '123456') {
      await AsyncStorage.setItem('isLoggedIn', 'true')
      await AsyncStorage.setItem('userInfo', JSON.stringify({ 
        username: username, 
        loginTime: new Date().toISOString() 
      }))
      Alert.alert('Đăng nhập thành công!', 'Chào mừng bạn quay trở lại!')
      if (redirect === 'checkout') {
        router.replace({
          pathname: '/checkout',
          params: { cart, location }
        })
      } else {
        router.replace('/')
      }
      return
    }

    // Kiểm tra tài khoản đã đăng ký
    try {
      const userData = await AsyncStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        if (user.username === username && user.password === password) {
          await AsyncStorage.setItem('isLoggedIn', 'true')
          await AsyncStorage.setItem('userInfo', JSON.stringify({ 
            username: username, 
            loginTime: new Date().toISOString(),
            ...user
          }))
          Alert.alert('Đăng nhập thành công!', `Chào mừng ${user.fullName || username} quay trở lại!`)
          if (redirect === 'checkout') {
            router.replace({
              pathname: '/checkout',
              params: { cart, location }
            })
          } else {
            router.replace('/')
          }
          return
        }
      }
    } catch (error) {
      console.log('Error checking user data:', error)
    }
    Alert.alert('Đăng nhập thất bại', 'Tên đăng nhập hoặc mật khẩu không đúng!\n\nVui lòng kiểm tra lại thông tin hoặc đăng ký tài khoản mới.')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/register')}>
        <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
      </Pressable>
      <Pressable onPress={() => router.replace('/')}>
        <Text style={[styles.link, { marginTop: 16 }]}>← Quay về trang chủ</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#3dd9eaff', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#3dd9eaff', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#3dd9eaff', textAlign: 'center', marginTop: 8 }
})