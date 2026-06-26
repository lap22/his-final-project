import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { API_URL } from "@/constants/Api";

const { width } = Dimensions.get("window");

// Kiểu dữ liệu cho Dashboard
interface UserDashboard {
  name: string;
  patientId: string;
  hasUpcomingAppointment: boolean;
  upcomingAppointment?: {
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    status: string;
  };
}

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UserDashboard | null>(null);

  // Hàm fetch dữ liệu từ Backend Dashboard Module
  const fetchDashboardData = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");

      // Gọi API lấy thông tin tổng hợp trang chủ
      const response = await axios.get(`${API_URL}/dashboard/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(response.data);
    } catch (error) {
      console.log("Lỗi nạp dữ liệu dashboard, dùng data mock tạm thời");
      // Data Mock dự phòng khi chưa thông API Backend hoàn toàn
      setData({
        name: "Nguyễn Văn A",
        patientId: "BN-2026-8899",
        hasUpcomingAppointment: true,
        upcomingAppointment: {
          doctorName: "BS. CKII. Lê Mạnh Hùng",
          specialty: "Khoa Tim Mạch",
          date: "30/06/2026",
          time: "09:30 - 10:00",
          status: "Đã duyệt",
        },
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={styles.loadingText}>
          Đang tải cổng thông tin sức khỏe...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 1. HEADER MODULE */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=120",
            }}
            style={styles.avatar}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>Xin chào 👋</Text>
            <Text style={styles.userName}>{data?.name || "Bệnh nhân"}</Text>
            <Text style={styles.patientId}>
              ID: {data?.patientId || "Chưa cập nhật"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notiButton}
          onPress={() => router.push("/notification" as any)}
        >
          <Ionicons name="notifications-outline" size={24} color="#1e293b" />
          <View style={styles.notiBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0284c7"]} // Đổi thành colors (mảng) dành cho Android
            tintColor="#0284c7" // Thêm tintColor dành cho iOS
          />
        }
      >
        {/* 2. BANNER PROMOTION */}
        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri: "https://img.freepik.com/free-vector/medical-technology-science-background-vector_53876-175184.jpg",
            }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Bác Sĩ Trợ Lý AI</Text>
            <Text style={styles.bannerSubtitle}>
              Tư vấn triệu chứng & Sắp xếp chuyên khoa chính xác 99%
            </Text>
            <TouchableOpacity
              style={styles.bannerBtn}
              onPress={() => router.push("/ai-chat" as any)}
            >
              <Text style={styles.bannerBtnText}>Chat Ngay</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. QUICK ACTION MODULE (Giao diện lưới 2x2 chuẩn Medpro) */}
        <Text style={styles.sectionTitle}>Dịch vụ cốt lõi</Text>
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push("/appointment" as any)}
          >
            <View style={[styles.iconWrapper, { backgroundColor: "#e0f2fe" }]}>
              <FontAwesome5 name="calendar-plus" size={24} color="#0284c7" />
            </View>
            <Text style={styles.gridLabel}>Đặt lịch khám</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push("/ai-chat" as any)}
          >
            <View style={[styles.iconWrapper, { backgroundColor: "#f0fdf4" }]}>
              <MaterialCommunityIcons name="robot" size={26} color="#22c55e" />
            </View>
            <Text style={styles.gridLabel}>Bác sĩ AI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push("/medical-record" as any)}
          >
            <View style={[styles.iconWrapper, { backgroundColor: "#fef3c7" }]}>
              <FontAwesome5 name="file-medical" size={24} color="#d97706" />
            </View>
            <Text style={styles.gridLabel}>Hồ sơ bệnh án</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push("/appointments" as any)}
          >
            <View style={[styles.iconWrapper, { backgroundColor: "#fae8ff" }]}>
              <FontAwesome5 name="clock" size={24} color="#c084fc" />
            </View>
            <Text style={styles.gridLabel}>Lịch hẹn của tôi</Text>
          </TouchableOpacity>
        </View>

        {/* 4. UPCOMING APPOINTMENT MODULE */}
        <Text style={styles.sectionTitle}>Lịch hẹn sắp diễn ra</Text>
        {data?.hasUpcomingAppointment && data.upcomingAppointment ? (
          <View style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <View style={styles.doctorInfoRow}>
                <FontAwesome5
                  name="user-md"
                  size={18}
                  color="#0284c7"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.appointmentDoctor}>
                  {data.upcomingAppointment.doctorName}
                </Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {data.upcomingAppointment.status}
                </Text>
              </View>
            </View>
            <Text style={styles.appointmentSpecialty}>
              {data.upcomingAppointment.specialty}
            </Text>
            <View style={styles.divider} />
            <View style={styles.appointmentFooter}>
              <View style={styles.dateTimeItem}>
                <Ionicons name="calendar-sharp" size={16} color="#64748b" />
                <Text style={styles.dateTimeText}>
                  {data.upcomingAppointment.date}
                </Text>
              </View>
              <View style={styles.dateTimeItem}>
                <Ionicons name="time-sharp" size={16} color="#64748b" />
                <Text style={styles.dateTimeText}>
                  {data.upcomingAppointment.time}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyAppointment}>
            <Text style={styles.emptyText}>
              Bạn không có lịch khám nào sắp tới.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/appointment" as any)}
            >
              <Text style={styles.bookingLink}>Đặt lịch ngay bây giờ</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 5. HEALTH TIPS MODULE (Cổng thông tin sức khỏe PHR) */}
        <View style={styles.tipsHeaderRow}>
          <Text style={styles.sectionTitle}>Kiến thức & Mẹo sức khỏe</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tipsScrollView}
        >
          <View style={styles.tipCard}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=200",
              }}
              style={styles.tipImage}
            />
            <Text style={styles.tipTitle} numberOfLines={2}>
              5 thói quen buổi sáng giúp tim luôn khỏe mạnh
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1511688868355-7216ee8d6d50?q=80&w=200",
              }}
              style={styles.tipImage}
            />
            <Text style={styles.tipTitle} numberOfLines={2}>
              Chế độ dinh dưỡng tối ưu phòng chống dịch mùa hè
            </Text>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", paddingTop: 50 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: { marginTop: 12, color: "#64748b", fontSize: 14 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  headerTextContainer: { marginLeft: 12 },
  greeting: { fontSize: 13, color: "#64748b", fontWeight: "500" },
  userName: { fontSize: 17, fontWeight: "700", color: "#0f172a" },
  patientId: {
    fontSize: 11,
    color: "#0284c7",
    fontWeight: "600",
    marginTop: 1,
  },
  notiButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  notiBadge: {
    position: "absolute",
    top: 12,
    right: 13,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
  },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 30 },
  bannerContainer: {
    width: "100%",
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: "#0f172a",
  },
  bannerImage: { width: "100%", height: "100%", opacity: 0.4 },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: "center",
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: "#cbd5e1",
    fontSize: 12,
    width: "75%",
    marginBottom: 12,
    lineHeight: 16,
  },
  bannerBtn: {
    backgroundColor: "#0284c7",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  bannerBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 14,
    marginTop: 4,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  gridItem: {
    width: (width - 44) / 2,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  gridLabel: { fontSize: 14, fontWeight: "600", color: "#334155" },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 24,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  doctorInfoRow: { flexDirection: "row", alignItems: "center" },
  appointmentDoctor: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
  statusBadge: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: { color: "#059669", fontSize: 11, fontWeight: "700" },
  appointmentSpecialty: {
    fontSize: 13,
    color: "#64748b",
    marginLeft: 26,
    marginBottom: 12,
  },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginBottom: 12 },
  appointmentFooter: { flexDirection: "row", marginLeft: 26 },
  dateTimeItem: { flexDirection: "row", alignItems: "center", marginRight: 24 },
  dateTimeText: {
    fontSize: 13,
    color: "#475569",
    marginLeft: 6,
    fontWeight: "500",
  },
  emptyAppointment: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginBottom: 24,
  },
  emptyText: { color: "#64748b", fontSize: 13, marginBottom: 4 },
  bookingLink: { color: "#0284c7", fontSize: 14, fontWeight: "600" },
  tipsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeMore: { color: "#0284c7", fontSize: 13, fontWeight: "600" },
  tipsScrollView: { flexDirection: "row" },
  tipCard: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  tipImage: { width: "100%", height: 100 },
  tipTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    padding: 10,
    lineHeight: 18,
  },
});
