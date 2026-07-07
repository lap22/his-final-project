import { useCallback, useEffect, useState } from 'react';
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
import {
  Appointment,
  AppointmentStatus,
  getAppointments,
} from '@/services/appointment';

const statusLabel: Record<AppointmentStatus, string> = {
  PENDING: 'Cho duyet',
  CONFIRMED: 'Da xac nhan',
  CANCELLED: 'Da huy',
  COMPLETED: 'Da kham',
};

const statusColor: Record<AppointmentStatus, { bg: string; text: string }> = {
  PENDING: { bg: '#fff7ed', text: '#c2410c' },
  CONFIRMED: { bg: '#ecfdf5', text: '#047857' },
  CANCELLED: { bg: '#fef2f2', text: '#b91c1c' },
  COMPLETED: { bg: '#eff6ff', text: '#1d4ed8' },
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Chua co thoi gian';
  }

  return `${date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })} - ${date.toLocaleDateString('vi-VN')}`;
}

function AppointmentCard({ item }: { item: Appointment }) {
  const status = statusColor[item.status] ?? statusColor.PENDING;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleGroup}>
          <Text style={styles.doctorName}>
            {item.doctor?.fullName ? `BS. ${item.doctor.fullName}` : 'Bac si chua cap nhat'}
          </Text>
          <Text style={styles.specialty}>
            {item.doctor?.specialty || 'Chuyen khoa chua cap nhat'}
          </Text>
        </View>

        <View style={[styles.badge, { backgroundColor: status.bg }]}>
          <Text style={[styles.badgeText, { color: status.text }]}>
            {statusLabel[item.status] ?? statusLabel.PENDING}
          </Text>
        </View>
      </View>

      <Text style={styles.time}>{formatDate(item.appointmentDate)}</Text>
      <Text style={styles.reason} numberOfLines={2}>
        {item.reason || 'Khong co ly do kham'}
      </Text>
    </View>
  );
}

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const data = await getAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
      setError('Khong the tai danh sach lich hen.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={styles.stateText}>Dang tai lich hen...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorTitle}>Khong tai duoc du lieu</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => loadAppointments()}>
          <Text style={styles.retryText}>Thu lai</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={appointments}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <AppointmentCard item={item} />}
        contentContainerStyle={[
          styles.listContent,
          appointments.length === 0 && styles.emptyContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadAppointments(true)}
            tintColor="#0284c7"
            colors={['#0284c7']}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Lich hen</Text>
            <Text style={styles.subtitle}>{appointments.length} lich hen</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Chua co lich hen</Text>
            <Text style={styles.emptyText}>
              Danh sach lich hen cua ban se hien thi tai day.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  stateText: {
    marginTop: 12,
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContent: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitleGroup: {
    flex: 1,
  },
  doctorName: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
  },
  specialty: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  time: {
    marginTop: 14,
    color: '#0369a1',
    fontSize: 14,
    fontWeight: '700',
  },
  reason: {
    marginTop: 8,
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    marginTop: 8,
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  errorTitle: {
    color: '#991b1b',
    fontSize: 18,
    fontWeight: '800',
  },
  errorText: {
    marginTop: 8,
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 18,
    backgroundColor: '#0284c7',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
});
