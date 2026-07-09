import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { API_BASE_URL } from '@/services/api';
import {
  getMedicalRecordById,
  MedicalFile,
  MedicalRecord,
  Prescription,
} from '@/services/medical-record.service';

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

function getSpecialtyName(record: MedicalRecord) {
  return record.doctor?.specialization || 'Chuyên khoa chưa cập nhật';
}

function getHospitalName(record: MedicalRecord) {
  return record.hospitalName || 'Bệnh viện chưa cập nhật';
}

function getDurationDays(prescription: Prescription) {
  return prescription.durationDays ?? prescription.days ?? prescription.quantity ?? null;
}

function resolveFileUrl(fileUrl: string) {
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl;
  }

  if (!API_BASE_URL) {
    return fileUrl;
  }

  return `${API_BASE_URL.replace(/\/$/, '')}/${fileUrl.replace(/^\//, '')}`;
}

async function openMedicalFile(file: MedicalFile) {
  const url = resolveFileUrl(file.fileUrl);

  if (await Linking.canOpenURL(url)) {
    await Linking.openURL(url);
  }
}

export default function MedicalRecordDetailScreen() {
  const params = useLocalSearchParams<{ recordId?: string }>();
  const recordId = Number(params.recordId);
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecord = useCallback(async () => {
    if (!Number.isFinite(recordId)) {
      setError('Mã bệnh án không hợp lệ.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setRecord(await getMedicalRecordById(recordId));
    } catch {
      setError('Không thể tải chi tiết bệnh án.');
    } finally {
      setLoading(false);
    }
  }, [recordId]);

  useEffect(() => {
    loadRecord();
  }, [loadRecord]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={styles.stateText}>Đang tải chi tiết bệnh án...</Text>
      </SafeAreaView>
    );
  }

  if (error || !record) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorTitle}>Không tải được dữ liệu</Text>
        <Text style={styles.emptyText}>{error ?? 'Không tìm thấy bệnh án.'}</Text>
        <Pressable style={styles.retryButton} onPress={loadRecord}>
          <Text style={styles.retryText}>Thử lại</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </Pressable>
        <Text style={styles.title}>Chi tiết bệnh án</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Thông tin tổng quan</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Ngày khám</Text>
              <Text style={styles.value}>{getRecordDate(record)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Bệnh viện</Text>
              <Text style={styles.value}>{getHospitalName(record)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Bác sĩ</Text>
              <Text style={styles.value}>{getDoctorName(record)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Chuyên khoa</Text>
              <Text style={styles.value}>{getSpecialtyName(record)}</Text>
            </View>
          </View>

          <Text style={styles.label}>Chẩn đoán</Text>
          <Text style={styles.value}>{record.diagnosis || 'Chưa cập nhật'}</Text>

          <Text style={styles.label}>Ghi chú bác sĩ</Text>
          <Text style={styles.body}>{record.note || 'Chưa có ghi chú.'}</Text>

          <Text style={styles.label}>Kết quả khám</Text>
          <Text style={styles.body}>{record.examinationResult || 'Chưa có kết quả khám.'}</Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đơn thuốc</Text>
            <Pressable style={styles.buyButton}>
              <Ionicons name="cart" size={17} color="#fff" />
              <Text style={styles.buyButtonText}>Mua thuốc online</Text>
            </Pressable>
          </View>

          {record.prescriptions?.length ? (
            record.prescriptions.map((prescription) => {
              const durationDays = getDurationDays(prescription);

              return (
                <View key={prescription.id} style={styles.prescriptionItem}>
                  <Text style={styles.medicineName}>{prescription.medicineName}</Text>
                  <Text style={styles.prescriptionText}>Liều lượng: {prescription.dosage}</Text>
                  <Text style={styles.prescriptionText}>Cách dùng: {prescription.instruction}</Text>
                  <Text style={styles.prescriptionText}>
                    Số ngày dùng: {durationDays ?? 'Chưa cập nhật'}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptySectionText}>Chưa có đơn thuốc.</Text>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Kết quả xét nghiệm</Text>

          {record.files?.length ? (
            record.files.map((file) => (
              <Pressable
                key={file.id}
                style={styles.fileItem}
                onPress={() => openMedicalFile(file)}
              >
                <View style={styles.fileIcon}>
                  <Ionicons
                    name={file.fileType?.toLowerCase().includes('pdf') ? 'document-text' : 'image'}
                    size={20}
                    color="#0284c7"
                  />
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file.fileName}
                  </Text>
                  <Text style={styles.fileType}>{file.fileType || 'Tệp đính kèm'}</Text>
                </View>
                <Ionicons name="open-outline" size={18} color="#64748b" />
              </Pressable>
            ))
          ) : (
            <Text style={styles.emptySectionText}>Chưa có file xét nghiệm đính kèm.</Text>
          )}
        </View>
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
  stateText: { marginTop: 12, color: '#475569', fontSize: 14, fontWeight: '600' },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title: { flex: 1, color: '#0f172a', fontSize: 20, fontWeight: '800' },
  content: { padding: 16, paddingTop: 0 },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  sectionCard: {
    marginTop: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '800',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  infoItem: {
    width: '47%',
  },
  label: {
    marginTop: 14,
    color: '#64748b',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  value: { marginTop: 5, color: '#0f172a', fontSize: 15, fontWeight: '800' },
  body: { marginTop: 5, color: '#475569', fontSize: 14, lineHeight: 20 },
  buyButton: {
    minHeight: 38,
    borderRadius: 10,
    backgroundColor: '#0284c7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  prescriptionItem: {
    marginTop: 12,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    padding: 12,
  },
  medicineName: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '800',
  },
  prescriptionText: {
    marginTop: 5,
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  fileItem: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    padding: 12,
  },
  fileIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f2fe',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800',
  },
  fileType: {
    marginTop: 3,
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  emptySectionText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  errorTitle: { color: '#991b1b', fontSize: 18, fontWeight: '800' },
  emptyText: {
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
  retryText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
