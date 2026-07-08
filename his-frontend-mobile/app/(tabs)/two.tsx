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
import { MedicalRecord, getMedicalRecords } from '@/services/medical-record.service';
import { getMyFamilyProfiles, PatientProfile } from '@/services/patient.service';

export default function TabTwoScreen() {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecords = useCallback(async (isRefresh = false) => {
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
        setRecords([]);
        return;
      }

      const data = await getMedicalRecords(activeProfile.id);
      setRecords(Array.isArray(data) ? data : []);
    } catch {
      setError('Khong the tai ho so benh an.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={styles.stateText}>Dang tai ho so benh an...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorTitle}>Khong tai duoc du lieu</Text>
        <Text style={styles.emptyText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => loadRecords()}>
          <Text style={styles.retryText}>Thu lai</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={records}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          styles.listContent,
          records.length === 0 && styles.emptyContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadRecords(true)}
            tintColor="#0284c7"
            colors={['#0284c7']}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Ho so benh an</Text>
            <Text style={styles.subtitle}>
              {profile?.fullName
                ? `${profile.fullName} - ${records.length} ho so`
                : 'Chua co ho so benh nhan'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>
              {profile ? 'Chua co benh an' : 'Chua co ho so benh nhan'}
            </Text>
            <Text style={styles.emptyText}>
              {profile
                ? 'Ho so benh an cua profile nay se hien thi tai day.'
                : 'Hay tao profile benh nhan de xem benh an theo tung thanh vien.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.recordTitle}>{item.diagnosis}</Text>
            <Text style={styles.meta}>
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString('vi-VN')
                : 'Chua co ngay tao'}
            </Text>
            {!!item.examinationResult && (
              <Text style={styles.bodyText}>{item.examinationResult}</Text>
            )}
            {!!item.note && <Text style={styles.bodyText}>{item.note}</Text>}
          </View>
        )}
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
  recordTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
  },
  meta: {
    marginTop: 6,
    color: '#0369a1',
    fontSize: 13,
    fontWeight: '700',
  },
  bodyText: {
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
