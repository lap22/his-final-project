import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getMedicalRecordsByPatient,
  getMedicalRecordsForPatients,
  MedicalRecord,
} from '@/services/medical-record.service';
import { getMyFamilyProfiles, PatientProfile } from '@/services/patient.service';

type PatientFilter = 'all' | number;

function getRecordDate(record: MedicalRecord) {
  const value = record.appointment?.appointmentDate ?? record.createdAt;
  const date = value ? new Date(value) : null;

  if (!date || Number.isNaN(date.getTime())) {
    return 'Chưa cập nhật';
  }

  return date.toLocaleDateString('vi-VN');
}

function getDoctorName(record: MedicalRecord) {
  return record.doctor?.fullName || record.doctor?.user?.fullName || 'Bác sĩ chưa cập nhật';
}

function getStatus(record: MedicalRecord) {
  return record.status || record.appointment?.status || 'Đã có bệnh án';
}

function MedicalRecordCard({ record }: { record: MedicalRecord }) {
  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/medical-record-detail/[recordId]',
          params: { recordId: String(record.id) },
        } as never)
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleGroup}>
          <Text style={styles.dateText}>{getRecordDate(record)}</Text>
          <Text style={styles.hospitalText}>
            {record.hospitalName || 'Bệnh viện chưa cập nhật'}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{getStatus(record)}</Text>
        </View>
      </View>

      <Text style={styles.doctorText}>{getDoctorName(record)}</Text>
      <Text style={styles.diagnosisText} numberOfLines={2}>
        {record.diagnosis || 'Chưa cập nhật chẩn đoán sơ bộ'}
      </Text>
    </Pressable>
  );
}

export default function MedicalRecordsScreen() {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientFilter>('all');
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPatientName = useMemo(() => {
    if (selectedPatient === 'all') {
      return 'Tất cả thành viên';
    }

    return patients.find((patient) => patient.id === selectedPatient)?.fullName ?? 'Bệnh nhân';
  }, [patients, selectedPatient]);

  const loadRecords = useCallback(async (patientFilter: PatientFilter, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const family = await getMyFamilyProfiles();
      setPatients(family);

      const data =
        patientFilter === 'all'
          ? await getMedicalRecordsForPatients(family.map((patient) => patient.id))
          : await getMedicalRecordsByPatient(patientFilter);

      setRecords(data);
    } catch {
      setError('Không thể tải lịch sử bệnh án.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRecords(selectedPatient);
  }, [loadRecords, selectedPatient]);

  const selectPatient = useCallback((patientFilter: PatientFilter) => {
    setSelectedPatient(patientFilter);
  }, []);

  const refresh = useCallback(() => {
    loadRecords(selectedPatient, true);
  }, [loadRecords, selectedPatient]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={styles.stateText}>Đang tải lịch sử bệnh án...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorTitle}>Không tải được dữ liệu</Text>
        <Text style={styles.emptyText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => loadRecords(selectedPatient)}>
          <Text style={styles.retryText}>Thử lại</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={records}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <MedicalRecordCard record={item} />}
        contentContainerStyle={[styles.listContent, records.length === 0 && styles.emptyContent]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#0284c7"
            colors={['#0284c7']}
          />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.topBar}>
              <Text style={styles.title}>Lịch sử bệnh án</Text>
              <View style={styles.actionGroup}>
                <Pressable style={styles.iconButton} accessibilityLabel="Tìm kiếm bệnh án">
                  <Ionicons name="search" size={20} color="#0f172a" />
                </Pressable>
                <Pressable style={styles.iconButton} accessibilityLabel="Lọc bệnh án">
                  <Ionicons name="filter" size={20} color="#0f172a" />
                </Pressable>
              </View>
            </View>

            <Text style={styles.subtitle}>
              {selectedPatientName} - {records.length} bệnh án
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.patientSelector}
            >
              <Pressable
                style={[
                  styles.patientChip,
                  selectedPatient === 'all' && styles.patientChipActive,
                ]}
                onPress={() => selectPatient('all')}
              >
                <Text
                  style={[
                    styles.patientChipText,
                    selectedPatient === 'all' && styles.patientChipTextActive,
                  ]}
                >
                  Tất cả
                </Text>
              </Pressable>

              {patients.map((patient) => {
                const isActive = selectedPatient === patient.id;

                return (
                  <Pressable
                    key={patient.id}
                    style={[styles.patientChip, isActive && styles.patientChipActive]}
                    onPress={() => selectPatient(patient.id)}
                  >
                    <Text
                      style={[
                        styles.patientChipText,
                        isActive && styles.patientChipTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {patient.fullName}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="document-text-outline" size={42} color="#0284c7" />
            <Text style={styles.emptyTitle}>Chưa có bệnh án</Text>
            <Text style={styles.emptyText}>
              Bệnh án của {selectedPatientName.toLowerCase()} sẽ hiển thị tại đây sau khi có dữ liệu từ hệ thống.
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: { flex: 1, color: '#0f172a', fontSize: 26, fontWeight: '800' },
  actionGroup: { flexDirection: 'row', gap: 8 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  subtitle: { marginTop: 6, color: '#64748b', fontSize: 14, fontWeight: '600' },
  patientSelector: { gap: 10, paddingVertical: 16 },
  patientChip: {
    maxWidth: 180,
    minHeight: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  patientChipActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
  },
  patientChipText: { color: '#475569', fontSize: 13, fontWeight: '800' },
  patientChipTextActive: { color: '#fff' },
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
  cardTitleGroup: { flex: 1 },
  dateText: { color: '#0369a1', fontSize: 14, fontWeight: '800' },
  hospitalText: { marginTop: 4, color: '#64748b', fontSize: 13, fontWeight: '600' },
  statusBadge: {
    borderRadius: 999,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: { color: '#0284c7', fontSize: 11, fontWeight: '800' },
  doctorText: { marginTop: 14, color: '#0f172a', fontSize: 15, fontWeight: '800' },
  diagnosisText: { marginTop: 8, color: '#475569', fontSize: 14, lineHeight: 20 },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: { marginTop: 14, color: '#0f172a', fontSize: 18, fontWeight: '800' },
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
