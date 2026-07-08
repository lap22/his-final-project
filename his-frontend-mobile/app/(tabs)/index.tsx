import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  ActivityIndicator, RefreshControl, 
  
} from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAppointments } from '@/services/appointment.service';
import { getMyFamilyProfiles } from '@/services/patient.service';

// 1. Khai báo địa chỉ API cố định của bạn


// 2. Định nghĩa Kiểu dữ liệu nhận từ BE
interface PatientProfile {
  id: number;
  fullName: string;
  patientCode?: string;
}

interface Appointment {
  id: number;
  appointmentDate: string;
  status: 'PENDING' | 'APPROVED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  reason: string;
  doctor: {
    fullName: string;
    specialty?: string;
    specialization?: string;
  };
}

export default function HomeScreen() {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3. Hàm bốc dữ liệu song song từ cả 2 API
const loadDashboardData = async () => {
  try {
    setLoading(true);
    setError(null);
    // 🚀 Đổi từ AsyncStorage sang SecureStore giống màn hình Login
    const token = await SecureStore.getItemAsync("userToken");

    console.log("🔑 Token lấy từ SecureStore:", token); // Log ra để kiểm tra xem hết null chưa

    if (!token) {
      setLoading(false);
      router.replace("/login"); // Nếu dùng expo-router thì điều hướng về login thế này
      return;
    }

    const family = await getMyFamilyProfiles();
    const activeProfile = family[0] ?? null;
    setProfile(activeProfile);

    if (!activeProfile) {
      setAppointments([]);
      return;
    }

    const appointmentData = await getAppointments(activeProfile.id);
    setAppointments(appointmentData as Appointment[]);

  } catch (error: any) {
    if (error?.response?.status === 401) {
      await SecureStore.deleteItemAsync("userToken");
      router.replace("/login");
      return;
    }
    console.error("Lỗi lấy dữ liệu Dashboard:", error);
    setError('Khong the tai du lieu trang chu.');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Hàm vuốt màn hình để reload dữ liệu
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, []);

  // 4. Hàm bổ trợ đổi màu sắc theo trạng thái lịch hẹn
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return { color: '#2e7d32', bg: '#e8f5e9', text: 'Đã xác nhận' };
      case 'CANCELLED': return { color: '#c62828', bg: '#ffebee', text: 'Đã hủy' };
      case 'COMPLETED': return { color: '#1565c0', bg: '#e3f2fd', text: 'Đã khám xong' };
      default: return { color: '#f57c00', bg: '#fff3e0', text: 'Chờ duyệt' };
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Đang tải dữ liệu thực từ DB...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorTitle}>Khong tai duoc du lieu</Text>
        <Text style={styles.emptyText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadDashboardData}>
          <Text style={styles.actionText}>Thu lai</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
    <View style={styles.container}>
      {/* HEADER: Thông tin bệnh nhân */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Xin chào 👋</Text>
        <Text style={styles.patientName}>{profile?.fullName || 'Bệnh nhân'}</Text>
        <Text style={styles.patientCode}>Mã số: {profile?.patientCode || 'Chưa cập nhật'}</Text>
      </View>

      {/* QUICK ACTIONS */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>📅 Đặt lịch mới</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#28a745' }]}>
          <Text style={styles.actionText}>📜 Hồ sơ bệnh án</Text>
        </TouchableOpacity>
      </View>

      {/* BODY: Danh sách lịch hẹn */}
      <Text style={styles.sectionTitle}>Lịch hẹn của bạn ({appointments.length})</Text>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Bạn chưa có lịch hẹn nào.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const statusStyle = getStatusStyle(item.status);
          const date = new Date(item.appointmentDate);

          return (
            <View style={styles.appointmentCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.doctorText}>BS. {item.doctor?.fullName}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusText, { color: statusStyle.color }]}>
                    {statusStyle.text}
                  </Text>
                </View>
              </View>

              <Text style={styles.specialtyText}>Chuyen khoa: {item.doctor?.specialty || item.doctor?.specialization || 'Chua cap nhat'}</Text>
              <Text style={styles.timeText}>
                ⏰ {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {date.toLocaleDateString('vi-VN')}
              </Text>
              <Text style={styles.reasonText} numberOfLines={1}>
                💬 Lý do: {item.reason}
              </Text>
            </View>
          );
        }}
      />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#007bff', padding: 25, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  welcomeText: { color: '#e0e0e0', fontSize: 14 },
  patientName: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 5 },
  patientCode: { color: '#fff', fontSize: 12, opacity: 0.8, marginTop: 5 },
  actionContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 15 },
  actionButton: { flex: 1, backgroundColor: '#007bff', padding: 15, borderRadius: 10, marginHorizontal: 5, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, marginTop: 10, marginBottom: 10, color: '#333' },
  appointmentCard: { backgroundColor: '#fff', padding: 15, marginHorizontal: 20, marginBottom: 12, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  doctorText: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  specialtyText: { fontSize: 13, color: '#7f8c8d', marginTop: 3 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  timeText: { fontSize: 14, color: '#27ae60', fontWeight: '600', marginTop: 8 },
  reasonText: { fontSize: 13, color: '#555', marginTop: 5, fontStyle: 'italic' },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#7f8c8d' },
  errorTitle: { color: '#991b1b', fontSize: 18, fontWeight: '800', marginBottom: 8 },
  retryButton: { marginTop: 16, backgroundColor: '#007bff', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 }
});
