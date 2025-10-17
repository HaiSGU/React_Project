import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { login } from '@shared/services/authService'
import colors from '@shared/theme/colors'

export default function LoginScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUsername('user')
    setPassword('123456')
  }, [])
// test merge branch
  
  const validate = () => {
    if (!username.trim()) {
      setError('Vui lòng nhập tên đăng nhập!')
      return false
    }
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu!')
      return false
    }
    setError('')
    return true
  }

  const handleLogin = async () => {
    if (!validate()) {
      Alert.alert('Lỗi', error)
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await login(AsyncStorage, username, password)
      
      if (result.success) {
        Alert.alert('Thành công', 'Đăng nhập thành công!', [
          { 
            text: 'OK', 
            onPress: () => {
              if (params.redirect === 'checkout' && params.cart && params.location) {
                router.replace({
                  pathname: '/checkout',
                  params: { cart: params.cart, location: params.location }
                })
              } else {
                router.replace('/(tabs)')
              }
            }
          }
        ])
      } else {
        Alert.alert('Lỗi', result.error)
      }
    } catch (err) {
      console.error('Login error:', err)
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoIcon}>🍔</Text>
        <Text style={styles.appName}>FoodFast</Text>
      </View>
      
      <Text style={styles.title}>Đăng nhập</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      <Pressable 
        style={[styles.loginBtn, loading && styles.loginBtnDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Chưa có tài khoản?</Text>
        <Pressable onPress={() => router.push('/register')}>
          <Text style={styles.registerLink}>Đăng ký ngay</Text>
        </Pressable>
      </View>

      <Text style={styles.demoText}>Demo: user / 123456</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    fontSize: 80,
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 24, 
    color: colors.primary,
    textAlign: 'center',
  },
  errorText: { 
    color: colors.danger, 
    marginBottom: 12, 
    fontSize: 14,
    textAlign: 'center',
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 16,
    fontSize: 16,
  },
  loginBtn: { 
    backgroundColor: colors.primary, 
    borderRadius: 8, 
    padding: 14, 
    alignItems: 'center', 
    marginBottom: 12,
  },
  loginBtnDisabled: {
    backgroundColor: '#ccc',
  },
  loginText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  demoText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 24,
  },
})
