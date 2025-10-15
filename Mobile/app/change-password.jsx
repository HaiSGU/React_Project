import React from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { changePassword, getCurrentUser } from '@shared/services/authService'
import { useChangePassword } from '@shared/hooks/useChangePassword'

export default function ChangePasswordScreen() {
  const router = useRouter()
  
  const {
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    loading,
    setLoading,
    validate,
    reset,
  } = useChangePassword()

  const handleChangePassword = async () => {
    setLoading(true)
    
    try {
      const user = await getCurrentUser(AsyncStorage)
      
      if (!user) {
        Alert.alert('Lỗi', 'Bạn chưa đăng nhập!')
        setLoading(false)
        return
      }
      
      if (!validate(user.password)) {
        Alert.alert('Lỗi', error)
        setLoading(false)
        return
      }
      
      const result = await changePassword(AsyncStorage, oldPassword, newPassword)
      
      if (result.success) {
        Alert.alert('Thành công', 'Đổi mật khẩu thành công!', [
          { text: 'OK', onPress: () => router.back() }
        ])
        reset()
      } else {
        Alert.alert('Lỗi', result.error)
      }
    } catch (err) {
      console.error('Change password error:', err)
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đổi mật khẩu</Text>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu cũ"
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
        editable={!loading}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        editable={!loading}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!loading}
        autoCapitalize="none"
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
  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 24, 
    color: '#3dd9eaff' 
  },
  errorText: { 
    color: '#ff3b30', 
    marginBottom: 12, 
    fontSize: 14,
    padding: 8,
    backgroundColor: '#ffebee',
    borderRadius: 4,
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 16,
    fontSize: 16,
  },
  saveBtn: { 
    backgroundColor: '#3dd9eaff', 
    borderRadius: 8, 
    padding: 14, 
    alignItems: 'center', 
    marginTop: 8,
  },
  saveBtnDisabled: {
    backgroundColor: '#ccc',
  },
  saveText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
})