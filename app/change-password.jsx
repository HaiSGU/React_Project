import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'

export default function ChangePasswordScreen() {
  const router = useRouter()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleChangePassword = async () => {
    const user = await AsyncStorage.getItem('user')
    if (!user) {
      Alert.alert('Bạn chưa đăng ký tài khoản!')
      return
    }
    const userObj = JSON.parse(user)
    if (oldPassword !== userObj.password) {
      Alert.alert('Mật khẩu cũ không đúng!')
      return
    }
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Mật khẩu mới phải từ 6 ký tự trở lên!')
      return
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mật khẩu xác nhận không khớp!')
      return
    }
    await AsyncStorage.setItem('user', JSON.stringify({ ...userObj, password: newPassword }))
    Alert.alert('Đổi mật khẩu thành công!')
    router.replace('/account')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đổi mật khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu cũ"
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Pressable style={styles.saveBtn} onPress={handleChangePassword}>
        <Text style={styles.saveText}>Đổi mật khẩu</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: '#00b14f' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  saveBtn: { backgroundColor: '#00b14f', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 12 },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
})