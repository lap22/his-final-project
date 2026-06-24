import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '@/constants/Api';
import { useRouter } from 'expo-router'; // Thay đổi từ router sang useRouter

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f5f7fb' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1e3a8a', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#6b7280', textAlign: 'center', marginBottom: 32 },
  input: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb', color: '#333' },
  button: { backgroundColor: '#10b981', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default function RegisterScreen() {
  const router = useRouter(); // Khai báo hook router chuẩn của Expo
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ các trường!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: name.trim(),
        email: email.trim(),
        phone: phone,
        password: password,
        roleId: 3 
      });

      Alert.alert(
        'Thành công', 
        'Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Xóa trắng form cũ
              setName('');
              setEmail('');
              setPhone('');
              setPassword('');
              // Đẩy người dùng quay lại màn hình Login
              router.replace('/login');
            }
          }
        ]
      );

    } catch (error: any) {
      let errorMsg = 'Đăng ký thất bại. Vui lòng thử lại!';
      const serverResponse = error.response?.data?.message;

      if (Array.isArray(serverResponse)) {
        errorMsg = serverResponse.join('\n'); 
      } else if (typeof serverResponse === 'string') {
        errorMsg = serverResponse;
      }
      Alert.alert('Lỗi Đăng Ký', errorMsg);
    } finally {
      setLoading(false); 
    }
  }; // Đã xóa dấu đóng ngoặc thừa ở đây

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo Tài Khoản</Text>
      <Text style={styles.subtitle}>Đăng ký hệ thống quản lý bệnh viện</Text>

      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Địa chỉ Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

       <TextInput
        style={styles.input}
        placeholder="Phone number"
        placeholderTextColor="#aaa"
        value={phone}
        onChangeText={setPhone}
        autoCapitalize="none"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Đăng Ký</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}