import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Appointment, getUpcomingAppointment } from '@/services/appointment.service';
import { getMyFamilyProfiles } from '@/services/patient.service';
import { CurrentUserProfile, getCurrentUserProfile } from '@/services/profile.service';
import { searchHome, SearchResult } from '@/services/search.service';
import { getSpecialties, Specialty } from '@/services/specialty.service';

const SEARCH_DEBOUNCE_MS = 400;

function getDisplayName(profile: CurrentUserProfile | null) {
  return profile?.fullName || profile?.name || profile?.email || 'Bạn';
}

function formatAppointmentTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Chưa có thời gian';
  }

  return `${date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })} - ${date.toLocaleDateString('vi-VN')}`;
}

function getDoctorName(appointment: Appointment | null) {
  const doctor = appointment?.doctor;
  return doctor?.fullName || doctor?.user?.fullName || 'Bác sĩ chưa cập nhật';
}

function getHospitalName(appointment: Appointment | null) {
  return appointment?.hospitalName || appointment?.hospital?.name || 'Bệnh viện chưa cập nhật';
}

export default function HomeScreen() {
  const [userProfile, setUserProfile] = useState<CurrentUserProfile | null>(null);
  const [upcomingAppointment, setUpcomingAppointment] = useState<Appointment | null>(null);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName = useMemo(() => getDisplayName(userProfile), [userProfile]);
  const avatarInitial = displayName.trim().charAt(0).toUpperCase() || 'B';

  const loadHomeData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const [profile, patientProfiles, specialtyData] = await Promise.all([
        getCurrentUserProfile(),
        getMyFamilyProfiles(),
        getSpecialties(),
      ]);

      const upcoming = await getUpcomingAppointment(
        patientProfiles.map((patientProfile) => patientProfile.id),
      );

      setUserProfile(profile);
      setSpecialties(specialtyData);
      setUpcomingAppointment(upcoming);
    } catch {
      setError('Không thể tải dữ liệu trang chủ.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  useEffect(() => {
    const keyword = searchQuery.trim();

    if (!keyword) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);

    const timeoutId = setTimeout(async () => {
      try {
        setSearchResults(await searchHome(keyword));
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const onRefresh = useCallback(() => {
    loadHomeData(true);
  }, [loadHomeData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={styles.stateText}>Đang tải trang chủ...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorTitle}>Không tải được dữ liệu</Text>
        <Text style={styles.emptyText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => loadHomeData()}>
          <Text style={styles.retryText}>Thử lại</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={specialties}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.specialtyRow}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0284c7"
            colors={['#0284c7']}
          />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.topBar}>
              <View style={styles.userGroup}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{avatarInitial}</Text>
                </View>
                <View style={styles.greetingGroup}>
                  <Text style={styles.greetingLabel}>Xin chào,</Text>
                  <Text style={styles.greetingName} numberOfLines={1}>
                    {displayName}
                  </Text>
                </View>
              </View>

              <Pressable style={styles.iconButton} accessibilityLabel="Thông báo">
                <Ionicons name="notifications-outline" size={22} color="#0f172a" />
              </Pressable>
            </View>

            <View style={styles.searchBox}>
              <Ionicons name="search" size={20} color="#64748b" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Tìm bác sĩ, chuyên khoa hoặc triệu chứng"
                placeholderTextColor="#94a3b8"
                style={styles.searchInput}
                returnKeyType="search"
              />
              {searching && <ActivityIndicator size="small" color="#0284c7" />}
            </View>

            {!!searchQuery.trim() && (
              <View style={styles.searchResults}>
                {searchResults.length > 0 ? (
                  searchResults.slice(0, 4).map((result) => (
                    <View key={`${result.type}-${result.id}`} style={styles.searchResultItem}>
                      <Text style={styles.searchResultTitle}>{result.title}</Text>
                      {!!result.subtitle && (
                        <Text style={styles.searchResultSubtitle}>{result.subtitle}</Text>
                      )}
                    </View>
                  ))
                ) : (
                  !searching && (
                    <Text style={styles.emptySearchText}>Chưa có kết quả phù hợp.</Text>
                  )
                )}
              </View>
            )}

            {upcomingAppointment ? (
              <View style={styles.appointmentBanner}>
                <View style={styles.bannerIcon}>
                  <Ionicons name="calendar" size={22} color="#0284c7" />
                </View>
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerLabel}>Lịch khám sắp tới</Text>
                  <Text style={styles.bannerTime}>
                    {formatAppointmentTime(upcomingAppointment.appointmentDate)}
                  </Text>
                  <Text style={styles.bannerMeta} numberOfLines={1}>
                    {getDoctorName(upcomingAppointment)} - {getHospitalName(upcomingAppointment)}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.emptyAppointment}>
                <Text style={styles.emptyAppointmentTitle}>Chưa có lịch khám sắp tới</Text>
                <Text style={styles.emptyAppointmentText}>
                  Bạn có thể đặt lịch khám mới khi cần tư vấn hoặc thăm khám.
                </Text>
              </View>
            )}

            <Pressable
              style={styles.bookingButton}
              onPress={() => router.push('/booking-flow' as never)}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.bookingText}>Đặt lịch ngay</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>Chuyên khoa</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Chưa có chuyên khoa</Text>
            <Text style={styles.emptyText}>
              Danh sách chuyên khoa sẽ hiển thị khi hệ thống có dữ liệu.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.specialtyCard}>
            <View style={styles.specialtyIcon}>
              <Ionicons name="medical" size={22} color="#0284c7" />
            </View>
            <Text style={styles.specialtyName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.specialtyMeta}>{item.doctorCount ?? 0} bác sĩ</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  stateText: { marginTop: 12, color: '#475569', fontSize: 14, fontWeight: '600' },
  content: { padding: 16, paddingBottom: 32 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  userGroup: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284c7',
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  greetingGroup: { flex: 1 },
  greetingLabel: { color: '#64748b', fontSize: 13, fontWeight: '600' },
  greetingName: { marginTop: 2, color: '#0f172a', fontSize: 20, fontWeight: '800' },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchBox: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  searchInput: { flex: 1, color: '#0f172a', fontSize: 14, fontWeight: '600' },
  searchResults: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchResultItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  searchResultTitle: { color: '#0f172a', fontSize: 14, fontWeight: '800' },
  searchResultSubtitle: { marginTop: 2, color: '#64748b', fontSize: 12, fontWeight: '600' },
  emptySearchText: { padding: 14, color: '#64748b', fontSize: 13, fontWeight: '600' },
  appointmentBanner: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  bannerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  bannerContent: { flex: 1 },
  bannerLabel: {
    color: '#0369a1',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  bannerTime: { marginTop: 4, color: '#0f172a', fontSize: 16, fontWeight: '800' },
  bannerMeta: { marginTop: 4, color: '#475569', fontSize: 13, fontWeight: '600' },
  emptyAppointment: {
    marginTop: 18,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyAppointmentTitle: { color: '#0f172a', fontSize: 15, fontWeight: '800' },
  emptyAppointmentText: {
    marginTop: 6,
    color: '#64748b',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  bookingButton: {
    marginTop: 16,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#0284c7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  bookingText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '800',
  },
  specialtyRow: { gap: 12 },
  specialtyCard: {
    flex: 1,
    minHeight: 128,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    marginBottom: 12,
  },
  specialtyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f2fe',
  },
  specialtyName: {
    marginTop: 12,
    color: '#0f172a',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
  specialtyMeta: { marginTop: 6, color: '#64748b', fontSize: 12, fontWeight: '700' },
  emptyBox: { alignItems: 'center', padding: 24 },
  emptyTitle: { color: '#0f172a', fontSize: 16, fontWeight: '800' },
  emptyText: {
    marginTop: 8,
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  errorTitle: { color: '#991b1b', fontSize: 18, fontWeight: '800' },
  retryButton: {
    marginTop: 18,
    backgroundColor: '#0284c7',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  retryText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
