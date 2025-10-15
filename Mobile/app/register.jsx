import React from 'react'
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  Alert, 
  ScrollView 
} from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRegister } from '@shared/hooks/useRegister'
import { register } from '@shared/services/authService' 
import colors from '@shared/theme/colors'

export default function RegisterScreen() {
  const router = useRouter()
  
  const {
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    fullName,
    setFullName,
    phone,
    setPhone,
    address,
    setAddress,
    gender,
    setGender,
    error,
    loading,
    setLoading,
    validate,
    getFormData,
  } = useRegister()

  const handleRegister = async () => {
    if (!validate()) {
      Alert.alert('Lỗi', error)
      return
    }

    setLoading(true)

    try {
      const result = await register(AsyncStorage, getFormData()) 
      
      if (result.success) {
        Alert.alert('Thành công', 'Đăng ký thành công! Vui lòng đăng nhập.', [
          { text: 'OK', onPress: () => router.replace('/login') }
        ])
      } else {
        Alert.alert('Lỗi', result.error)
      }
    } catch (err) {
      console.error('Register error:', err)
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Đăng ký tài khoản</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập *"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu *"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu *"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Họ và tên *"
        value={fullName}
        onChangeText={setFullName}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Số điện thoại *"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Địa chỉ *"
        value={address}
        onChangeText={setAddress}
        multiline
        editable={!loading}
      />

      <Text style={styles.label}>Giới tính *</Text>
      <View style={styles.genderRow}>
        <Pressable
          style={[
            styles.genderBtn,
            gender === 'male' && styles.genderBtnSelected
          ]}
          onPress={() => setGender('male')}
          disabled={loading}
        >
          <Text style={[
            styles.genderText,
            gender === 'male' && styles.genderTextSelected
          ]}>
            Nam
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.genderBtn,
            gender === 'female' && styles.genderBtnSelected
          ]}
          onPress={() => setGender('female')}
          disabled={loading}
        >
          <Text style={[
            styles.genderText,
            gender === 'female' && styles.genderTextSelected
          ]}>
            Nữ
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.genderBtn,
            gender === 'other' && styles.genderBtnSelected
          ]}
          onPress={() => setGender('other')}
          disabled={loading}
        >
          <Text style={[
            styles.genderText,
            gender === 'other' && styles.genderTextSelected
          ]}>
            Khác
          </Text>
        </Pressable>
      </View>

      <Pressable 
        style={[styles.registerBtn, loading && styles.registerBtnDisabled]} 
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.registerText}>
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Đã có tài khoản?</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.loginLink}>Đăng nhập</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: '#fff',
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  genderRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  genderBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  genderBtnSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  genderText: {
    fontSize: 16,
    color: '#666',
  },
  genderTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  registerBtn: { 
    backgroundColor: colors.primary, 
    borderRadius: 8, 
    padding: 14, 
    alignItems: 'center', 
    marginBottom: 12,
  },
  registerBtnDisabled: {
    backgroundColor: '#ccc',
  },
  registerText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
})