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

import { getMyFamilyProfiles, PatientProfile } from '@/services/patient.service';
import { getQueueByProfile, QueueItem } from '@/services/queue.service';

const statusLabel: Record<string, string> = {
  WAITING: 'Đang chờ',
  CALLED: 'Đã gọi',
  SERVING: 'Đang khám',
  DONE: 'Hoàn tất',
  CANCELLED: 'Đã hủy',
};

function formatTime(value?: string) {
  if (!value) {
    return 'Chưa có thời gian dự kiến';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })} - ${date.toLocaleDateString('vi-VN')}`;
}

function QueueCard({ item }: { item: QueueItem }) {
  const status = item.status ? statusLabel[item.status] ?? item.status : 'Đang chờ';

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.queueNumber}>
          {item.queueNumber ? `Số ${item.queueNumber}` : `Lượt chờ #${item.id}`}
        </Text>
        <Text style={styles.time}>{formatTime(item.estimatedTime)}</Text>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{status}</Text>
      </View>
    </View>
  );
}

export default function LiveQueueScreen() {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
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
      const family = await getMyFamilyProfiles();
      const activeProfile = family[0] ?? null;
      setProfile(activeProfile);

      if (!activeProfile) {
        setQueue([]);
        return;
      }

      const data = await getQueueByProfile(activeProfile.id);
      setQueue(Array.isArray(data) ? data : []);
    } catch {
      setError('Không thể tải thông tin phòng chờ.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

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
      <FlatList
        data={queue}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <QueueCard item={item} />}
        contentContainerStyle={[styles.listContent, queue.length === 0 && styles.emptyContent]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadQueue(true)}
            tintColor="#0284c7"
            colors={['#0284c7']}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Phòng chờ</Text>
            <Text style={styles.subtitle}>
              {profile?.fullName ? `${profile.fullName} - ${queue.length} lượt chờ` : 'Chưa có hồ sơ bệnh nhân'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>
              {profile ? 'Chưa có lượt chờ' : 'Chưa có hồ sơ bệnh nhân'}
            </Text>
            <Text style={styles.emptyText}>
              {profile
                ? 'Thông tin số thứ tự và trạng thái phòng chờ sẽ hiển thị tại đây.'
                : 'Hãy tạo hồ sơ bệnh nhân để theo dõi phòng chờ.'}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  queueNumber: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
  time: {
    marginTop: 6,
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#eff6ff',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: '#0284c7',
    fontSize: 11,
    fontWeight: '800',
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
