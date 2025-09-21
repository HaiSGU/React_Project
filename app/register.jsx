import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function RegisterScreen() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [gender, setGender] = useState('')
  const router = useRouter()

  const handleRegister = async () => {
    // Validation đầy đủ
    if (!username.trim()) {
      Alert.alert('Lỗi đăng ký', 'Vui lòng nhập tên đăng nhập!')
      return
    }
    if (!password.trim()) {
      Alert.alert('Lỗi đăng ký', 'Vui lòng nhập mật khẩu!')
      return
    }
    if (!fullName.trim()) {
      Alert.alert('Lỗi đăng ký', 'Vui lòng nhập họ tên!')
      return
    }
    if (!phone.trim()) {
      Alert.alert('Lỗi đăng ký', 'Vui lòng nhập số điện thoại!')
      return
    }
    if (!address.trim()) {
      Alert.alert('Lỗi đăng ký', 'Vui lòng nhập địa chỉ!')
      return
    }
    if (!gender) {
      Alert.alert('Lỗi đăng ký', 'Vui lòng chọn giới tính!')
      return
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi đăng ký', 'Mật khẩu xác nhận không khớp!')
      return
    }
    if (password.length < 6) {
      Alert.alert('Lỗi đăng ký', 'Mật khẩu phải có ít nhất 6 ký tự!')
      return
    }
    if (phone.length < 10) {
      Alert.alert('Lỗi đăng ký', 'Số điện thoại không hợp lệ!')
      return
    }
    
    // Kiểm tra tài khoản đã tồn tại chưa
    try {
      const existingUser = await AsyncStorage.getItem('user')
      if (existingUser) {
        const user = JSON.parse(existingUser)
        if (user.username === username) {
          Alert.alert('Lỗi đăng ký', 'Tên đăng nhập đã tồn tại!\nVui lòng chọn tên khác.')
          return
        }
        if (user.phone === phone) {
          Alert.alert('Lỗi đăng ký', 'Số điện thoại đã được sử dụng!\nVui lòng sử dụng số khác.')
          return
        }
      }
    } catch (error) {
      console.log('Error checking existing user:', error)
    }
    
    // Lưu tài khoản mới với đầy đủ thông tin
    const userData = {
      username, 
      password,
      fullName,
      phone,
      address,
      gender,
      registerTime: new Date().toISOString()
    }
    
    await AsyncStorage.setItem('user', JSON.stringify(userData))
    
    // Tự động đăng nhập sau khi đăng ký
    await AsyncStorage.setItem('isLoggedIn', 'true')
    await AsyncStorage.setItem('userInfo', JSON.stringify({ 
      username: username, 
      loginTime: new Date().toISOString(),
      ...userData // Bao gồm tất cả thông tin cá nhân
    }))
    
    Alert.alert('Đăng ký thành công!', `Chào mừng ${fullName} đến với FoodFast!\nBạn đã được tự động đăng nhập.`)
    router.replace('/')
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Đăng ký tài khoản</Text>
      
      <Text style={styles.sectionTitle}>Thông tin đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập *"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu (ít nhất 6 ký tự) *"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu *"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ và tên *"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại *"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Địa chỉ *"
        value={address}
        onChangeText={setAddress}
        multiline
        numberOfLines={3}
      />
      
      <Text style={styles.sectionTitle}>Giới tính *</Text>
      <View style={styles.genderContainer}>
        <Pressable 
          style={[styles.genderButton, gender === 'Nam' && styles.genderButtonSelected]}
          onPress={() => setGender('Nam')}
        >
          <Text style={[styles.genderText, gender === 'Nam' && styles.genderTextSelected]}>Nam</Text>
        </Pressable>
        <Pressable 
          style={[styles.genderButton, gender === 'Nữ' && styles.genderButtonSelected]}
          onPress={() => setGender('Nữ')}
        >
          <Text style={[styles.genderText, gender === 'Nữ' && styles.genderTextSelected]}>Nữ</Text>
        </Pressable>
        <Pressable 
          style={[styles.genderButton, gender === 'Khác' && styles.genderButtonSelected]}
          onPress={() => setGender('Khác')}
        >
          <Text style={[styles.genderText, gender === 'Khác' && styles.genderTextSelected]}>Khác</Text>
        </Pressable>
      </View>
      
      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/login')}>
        <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#00b14f', textAlign: 'center' },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 20, 
    marginBottom: 12, 
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 16,
    backgroundColor: '#f9f9f9'
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top'
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  genderButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9'
  },
  genderButtonSelected: {
    backgroundColor: '#00b14f',
    borderColor: '#00b14f'
  },
  genderText: {
    color: '#666',
    fontWeight: '500'
  },
  genderTextSelected: {
    color: '#fff',
    fontWeight: 'bold'
  },
  button: { 
    backgroundColor: '#00b14f', 
    borderRadius: 8, 
    padding: 14, 
    alignItems: 'center', 
    marginBottom: 12,
    marginTop: 10
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#00b14f', textAlign: 'center', marginTop: 8 }
})