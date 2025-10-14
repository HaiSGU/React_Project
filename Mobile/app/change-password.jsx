import React from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { changePassword, getCurrentUser } from '@shared/services/authService'
import { useChangePassword } from '@shared/hooks/useChangePassword'

export default function ChangePasswordScreen() {
  const router = useRouter()
  
  // ✅ Sử dụng custom hook từ shared
  const {
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    loading,
    setLoading,
    validate,
    reset,
  } = useChangePassword()

  const handleChangePassword = async () => {
    setLoading(true)
    setError('')
    
    try {
      const user = await getCurrentUser(AsyncStorage)
      
      if (!user) {
        Alert.alert('Lỗi', 'Bạn chưa đăng nhập!')
        return
      }
      
      // ✅ Validate sử dụng shared logic
      if (!validate(user.password)) {
        Alert.alert('Lỗi', error)
        return
      }
      
      // ✅ Sử dụng shared service
      const result = await changePassword(AsyncStorage, oldPassword, newPassword)
      
      if (result.success) {
        Alert.alert('Thành công', 'Đổi mật khẩu thành công!')
        reset()
        router.replace('/account')
      } else {
        Alert.alert('Lỗi', result.error)
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đổi mật khẩu</Text>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu cũ"
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!loading}
      />
      
      <Pressable 
        style={[styles.saveBtn, loading && styles.saveBtnDisabled]} 
        onPress={handleChangePassword}
        disabled={loading}
      >
        <Text style={styles.saveText}>
          {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: '#3dd9eaff' },
  errorText: { color: '#ff3b30', marginBottom: 12, fontSize: 14 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 16 
  },
  saveBtn: { 
    backgroundColor: '#3dd9eaff', 
    borderRadius: 8, 
    padding: 14, 
    alignItems: 'center', 
    marginBottom: 12 
  },
  saveBtnDisabled: {
    backgroundColor: '#ccc',
  },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
})