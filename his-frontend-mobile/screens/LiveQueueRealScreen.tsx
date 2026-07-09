import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  findWaitingAppointment,
  getQueueByAppointmentId,
  getTodayAppointments,
  QueueInfo,
} from '@/services/queue.service';

const POLLING_INTERVAL_MS = 12000;

const statusLabel: Record<string, string> = {
  PENDING: 'Đang chờ',
  APPROVED: 'Đã duyệt',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã hủy',
};

function getProgress(queue: QueueInfo) {
  if (queue.patientQueueNumber <= 0) {
    return 0;
  }

  return Math.min(queue.currentQueueNumber / queue.patientQueueNumber, 1);
}

export default function LiveQueueScreen() {
  const [queue, setQueue] = useState<QueueInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQueue = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const todayAppointments = await getTodayAppointments();
      const waitingAppointment = findWaitingAppointment(todayAppointments);

      if (!waitingAppointment) {
        setQueue(null);
        return;
      }

      setQueue(await getQueueByAppointmentId(waitingAppointment.id));
    } catch {
      setError('Không thể tải thông tin phòng chờ.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadQueue();

      const intervalId = setInterval(() => {
        loadQueue(true);
      }, POLLING_INTERVAL_MS);

      return () => clearInterval(intervalId);
    }, [loadQueue]),
  );

  const progress = queue ? getProgress(queue) : 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={styles.stateText}>Đang tải phòng chờ...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorTitle}>Không tải được dữ liệu</Text>
        <Text style={styles.emptyText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => loadQueue()}>
          <Text style={styles.retryText}>Thử lại</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, !queue && styles.emptyContent]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadQueue(true)}
            tintColor="#0284c7"
            colors={['#0284c7']}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Phòng chờ</Text>
          <Text style={styles.subtitle}>Theo dõi số thứ tự khám trong ngày</Text>
        </View>

        {!queue ? (
          <View style={styles.emptyBox}>
            <Ionicons name="time-outline" size={42} color="#0284c7" />
            <Text style={styles.emptyTitle}>Không có lịch khám đang chờ</Text>
            <Text style={styles.emptyText}>
              Khi bạn có lịch khám trong ngày và đang chờ đến lượt, thông tin phòng chờ sẽ hiển thị tại đây.
            </Text>
            <Pressable style={styles.refreshButton} onPress={() => loadQueue(true)}>
              <Ionicons name="refresh" size={18} color="#fff" />
              <Text style={styles.refreshText}>Làm mới</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.queueCard}>
            <View style={styles.doctorCard}>
              <View style={styles.doctorIcon}>
                <Ionicons name="person" size={24} color="#0284c7" />
              </View>
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{queue.doctorName}</Text>
                <Text style={styles.metaText}>{queue.specialtyName}</Text>
                <Text style={styles.metaText}>{queue.roomName}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {statusLabel[queue.status] ?? queue.status}
                </Text>
              </View>
            </View>

            <View style={styles.numberPanel}>
              <View style={styles.numberBlock}>
                <Text style={styles.numberLabel}>STT của bạn</Text>
                <Text style={styles.patientNumber}>{queue.patientQueueNumber}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.numberBlock}>
                <Text style={styles.numberLabel}>Đang khám</Text>
                <Text style={styles.currentNumber}>{queue.currentQueueNumber}</Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>

            <Text style={styles.waitingText}>
              Còn khoảng {queue.estimatedWaitingCount} lượt nữa đến bạn
            </Text>

            <Pressable style={styles.refreshButton} onPress={() => loadQueue(true)}>
              <Ionicons name="refresh" size={18} color="#fff" />
              <Text style={styles.refreshText}>Làm mới</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
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
  content: { padding: 16, paddingBottom: 32 },
  emptyContent: { flexGrow: 1 },
  stateText: { marginTop: 12, color: '#475569', fontSize: 14, fontWeight: '600' },
  header: { marginBottom: 16 },
  title: { color: '#0f172a', fontSize: 28, fontWeight: '800' },
  subtitle: { marginTop: 4, color: '#64748b', fontSize: 14, fontWeight: '600' },
  queueCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  doctorCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  doctorIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f2fe',
  },
  doctorInfo: { flex: 1 },
  doctorName: { color: '#0f172a', fontSize: 17, fontWeight: '800' },
  metaText: { marginTop: 3, color: '#64748b', fontSize: 13, fontWeight: '600' },
  statusBadge: {
    borderRadius: 999,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: { color: '#0284c7', fontSize: 11, fontWeight: '800' },
  numberPanel: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  numberBlock: { flex: 1, alignItems: 'center' },
  numberLabel: { color: '#64748b', fontSize: 13, fontWeight: '700' },
  patientNumber: { marginTop: 6, color: '#0f172a', fontSize: 42, fontWeight: '900' },
  currentNumber: { marginTop: 6, color: '#0284c7', fontSize: 56, fontWeight: '900' },
  divider: { width: 1, height: 76, backgroundColor: '#e2e8f0' },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
    marginTop: 24,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: '#0284c7' },
  waitingText: {
    marginTop: 14,
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: 20,
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: '#0284c7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  refreshText: { color: '#fff', fontSize: 14, fontWeight: '800' },
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
