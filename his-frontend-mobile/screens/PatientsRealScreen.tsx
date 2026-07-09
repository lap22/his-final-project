import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getPatients, PatientProfile } from '@/services/patient.service';

function formatBirthday(value?: string | null) {
  if (!value) {
    return 'Chưa cập nhật ngày sinh';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('vi-VN');
}

function formatGender(value?: PatientProfile['gender']) {
  if (value === 'MALE') return 'Nam';
  if (value === 'FEMALE') return 'Nữ';
  if (value === 'OTHER') return 'Khác';
  return 'Chưa cập nhật';
}

function PatientCard({ item }: { item: PatientProfile }) {
  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/add-edit-patient',
          params: { patientId: String(item.id) },
        } as never)
      }
    >
      <View style={styles.avatar}>
        <Ionicons name="person" size={24} color="#0284c7" />
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.patientName} numberOfLines={1}>
          {item.fullName}
        </Text>
        <Text style={styles.meta}>Ngày sinh: {formatBirthday(item.birthday)}</Text>
        <Text style={styles.meta}>Giới tính: {formatGender(item.gender)}</Text>
        <Text style={styles.meta}>Quan hệ: {item.relationship || 'Chưa cập nhật'}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
    </Pressable>
  );
}

export default function PatientsScreen() {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPatients = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      setPatients(await getPatients());
    } catch {
      setError('Không thể tải danh sách hồ sơ gia đình.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPatients();
    }, [loadPatients]),
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={styles.stateText}>Đang tải hồ sơ gia đình...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorTitle}>Không tải được dữ liệu</Text>
        <Text style={styles.emptyText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => loadPatients()}>
          <Text style={styles.retryText}>Thử lại</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={patients}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <PatientCard item={item} />}
        contentContainerStyle={[styles.listContent, patients.length === 0 && styles.emptyContent]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadPatients(true)}
            tintColor="#0284c7"
            colors={['#0284c7']}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.topBar}>
              <Text style={styles.title}>Sổ hồ sơ gia đình</Text>
            </View>
            <Text style={styles.subtitle}>{patients.length} hồ sơ trong tài khoản</Text>
            <Pressable
              style={styles.addButton}
              onPress={() => router.push('/add-edit-patient' as never)}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Thêm thành viên mới</Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="people-outline" size={42} color="#0284c7" />
            <Text style={styles.emptyTitle}>Chưa có hồ sơ bệnh nhân</Text>
            <Text style={styles.emptyText}>
              Thêm thành viên để quản lý lịch khám và bệnh án cho cả gia đình.
            </Text>
          </View>
        }
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
  listContent: { padding: 16, paddingBottom: 32 },
  emptyContent: { flexGrow: 1 },
  header: { marginBottom: 16 },
  topBar: {
    minHeight: 40,
    justifyContent: 'center',
  },
  title: { color: '#0f172a', fontSize: 26, fontWeight: '800' },
  subtitle: { marginTop: 4, color: '#64748b', fontSize: 14, fontWeight: '600' },
  addButton: {
    marginTop: 16,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#0284c7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f2fe',
  },
  cardBody: { flex: 1 },
  patientName: { color: '#0f172a', fontSize: 17, fontWeight: '800' },
  meta: { marginTop: 5, color: '#475569', fontSize: 13, fontWeight: '600' },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    marginTop: 14,
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
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
