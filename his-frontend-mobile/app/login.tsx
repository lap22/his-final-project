import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '@/constants/Api';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Kiểm tra dữ liệu đầu vào sơ bộ (Validation)
    if (!email.trim() || !password) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ Email và Mật khẩu!');
      return;
    }

    setLoading(true);
    try {
      // 2. Gọi API đăng nhập đến Backend NestJS
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email.trim().toLowerCase(),
        password: password
      });

      // Lấy accessToken từ cấu hình dữ liệu trả về của Backend
      const { accessToken } = response.data;

      if (accessToken) {
        // 3. Lưu trữ mã Token vào bộ nhớ bảo mật của thiết bị
        await SecureStore.setItemAsync('userToken', accessToken);
        
        // 4. Đăng nhập thành công -> Điều hướng thẳng vào cụm màn hình chính (Tabs)
        router.replace('/(tabs)');
        Alert.alert('thanh cong','Dang nhap thanh cong');
      } else {
        Alert.alert('Thất bại', 'Không nhận được mã xác thực từ hệ thống.');
      }

    } catch (error: any) {
      // 5. Xử lý bắt các kịch bản lỗi từ NestJS trả về (Sai mật khẩu, không tồn tại email...)
      const errorMsg = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại kết nối mạng!';
      Alert.alert('Lỗi Đăng Nhập', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // KeyboardAvoidingView giúp đẩy giao diện lên khi bàn phím ảo điện thoại hiện lên, không bị che ô nhập
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          {/* Header */}
          <Text style={styles.title}>HOSPITAL SYSTEM</Text>
          <Text style={styles.subtitle}>Hệ thống Quản lý Bệnh viện & Bác sĩ AI</Text>

          {/* Ô nhập Email */}
          <Text style={styles.label}>Địa chỉ Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email của bạn..."
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Ô nhập Mật khẩu */}
          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu..."
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Nút Đăng nhập */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Đăng Nhập</Text>
            )}
          </TouchableOpacity>

          {/* Link chuyển sang trang Đăng ký */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Chưa có tài khoản bệnh nhân? </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    backgroundColor: '#f8fafc',
    padding: 20 
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4, // Đổ bóng cho Android
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#1e3a8a', 
    textAlign: 'center', 
    marginBottom: 6,
    letterSpacing: 0.5
  },
  subtitle: { 
    fontSize: 14, 
    color: '#64748b', 
    textAlign: 'center', 
    marginBottom: 32 
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    paddingLeft: 4
  },
  input: { 
    backgroundColor: '#f1f5f9', 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    borderRadius: 12, 
    fontSize: 16, 
    marginBottom: 18, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    color: '#0f172a' 
  },
  button: { 
    backgroundColor: '#2563eb', 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
  },
  linkText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  }
});