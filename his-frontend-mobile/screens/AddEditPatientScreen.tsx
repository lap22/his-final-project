import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  createPatientProfile,
  deletePatientProfile,
  getPatientErrorMessage,
  getPatientProfile,
  PatientProfile,
  updatePatientProfile,
} from '@/services/patient.service';

type Gender = 'MALE' | 'FEMALE' | 'OTHER';

interface PatientFormState {
  fullName: string;
  phone: string;
  gender: Gender | '';
  birthday: string;
  address: string;
  bloodType: string;
  insuranceNumber: string;
  relationship: string;
  medicalHistory: string;
  emergencyContact: string;
}

const emptyForm: PatientFormState = {
  fullName: '',
  phone: '',
  gender: '',
  birthday: '',
  address: '',
  bloodType: '',
  insuranceNumber: '',
  relationship: '',
  medicalHistory: '',
  emergencyContact: '',
};

function toForm(profile: PatientProfile): PatientFormState {
  return {
    fullName: profile.fullName ?? '',
    phone: profile.phone ?? '',
    gender: profile.gender ?? '',
    birthday: profile.birthday ? profile.birthday.slice(0, 10) : '',
    address: profile.address ?? '',
    bloodType: profile.bloodType ?? '',
    insuranceNumber: profile.insuranceNumber ?? '',
    relationship: profile.relationship ?? '',
    medicalHistory: profile.medicalHistory ?? '',
    emergencyContact: profile.emergencyContact ?? '',
  };
}

function cleanPayload(form: PatientFormState) {
  return {
    fullName: form.fullName.trim(),
    phone: form.phone.trim() || undefined,
    gender: form.gender || undefined,
    birthday: form.birthday.trim() || undefined,
    address: form.address.trim() || undefined,
    bloodType: form.bloodType.trim() || undefined,
    insuranceNumber: form.insuranceNumber.trim() || undefined,
    relationship: form.relationship.trim() || undefined,
    medicalHistory: form.medicalHistory.trim() || undefined,
    emergencyContact: form.emergencyContact.trim() || undefined,
  };
}

export default function AddEditPatientScreen() {
  const params = useLocalSearchParams<{ patientId?: string }>();
  const patientId = params.patientId ? Number(params.patientId) : null;
  const isEditMode = Number.isFinite(patientId);

  const [form, setForm] = useState<PatientFormState>(emptyForm);
  const [loading, setLoading] = useState(Boolean(isEditMode));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(
    () => (isEditMode ? 'Cập nhật hồ sơ' : 'Thêm thành viên mới'),
    [isEditMode],
  );

  const updateField = useCallback(
    <K extends keyof PatientFormState>(key: K, value: PatientFormState[K]) => {
      setForm((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const loadPatient = useCallback(async () => {
    if (!isEditMode || !patientId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setForm(toForm(await getPatientProfile(patientId)));
    } catch (apiError) {
      setError(getPatientErrorMessage(apiError, 'Không thể tải hồ sơ bệnh nhân.'));
    } finally {
      setLoading(false);
    }
  }, [isEditMode, patientId]);

  useEffect(() => {
    loadPatient();
  }, [loadPatient]);

  const save = useCallback(async () => {
    const payload = cleanPayload(form);

    if (!payload.fullName) {
      setError('Vui lòng nhập họ tên.');
      return;
    }

    if (!payload.birthday) {
      setError('Vui lòng nhập ngày sinh.');
      return;
    }

    if (!payload.gender) {
      setError('Vui lòng chọn giới tính.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isEditMode && patientId) {
        await updatePatientProfile(patientId, payload);
      } else {
        await createPatientProfile(payload);
      }

      router.back();
    } catch (apiError) {
      setError(getPatientErrorMessage(apiError, 'Không thể lưu hồ sơ bệnh nhân.'));
    } finally {
      setSaving(false);
    }
  }, [form, isEditMode, patientId]);

  const remove = useCallback(() => {
    if (!isEditMode || !patientId) {
      return;
    }

    Alert.alert('Xóa hồ sơ', 'Bạn có chắc muốn xóa hồ sơ này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          setSaving(true);
          setError(null);

          try {
            await deletePatientProfile(patientId);
            router.back();
          } catch (apiError) {
            setError(getPatientErrorMessage(apiError, 'Không thể xóa hồ sơ bệnh nhân.'));
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  }, [isEditMode, patientId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={styles.stateText}>Đang tải hồ sơ...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.formCard}>
          <Text style={styles.label}>Họ tên</Text>
          <TextInput
            value={form.fullName}
            onChangeText={(value) => updateField('fullName', value)}
            style={styles.input}
            placeholder="Nguyễn Văn A"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Ngày sinh</Text>
          <TextInput
            value={form.birthday}
            onChangeText={(value) => updateField('birthday', value)}
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Giới tính</Text>
          <View style={styles.segmentGroup}>
            {[
              { label: 'Nam', value: 'MALE' },
              { label: 'Nữ', value: 'FEMALE' },
              { label: 'Khác', value: 'OTHER' },
            ].map((option) => {
              const active = form.gender === option.value;

              return (
                <Pressable
                  key={option.value}
                  style={[styles.segment, active && styles.segmentActive]}
                  onPress={() => updateField('gender', option.value as Gender)}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            value={form.phone}
            onChangeText={(value) => updateField('phone', value)}
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="0909123456"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Nhóm máu</Text>
          <TextInput
            value={form.bloodType}
            onChangeText={(value) => updateField('bloodType', value)}
            style={styles.input}
            placeholder="O+"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Mã BHYT</Text>
          <TextInput
            value={form.insuranceNumber}
            onChangeText={(value) => updateField('insuranceNumber', value)}
            style={styles.input}
            placeholder="BHYT123456789"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Quan hệ với chủ tài khoản</Text>
          <TextInput
            value={form.relationship}
            onChangeText={(value) => updateField('relationship', value)}
            style={styles.input}
            placeholder="Bản thân, con, bố, mẹ..."
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Liên hệ khẩn cấp</Text>
          <TextInput
            value={form.emergencyContact}
            onChangeText={(value) => updateField('emergencyContact', value)}
            style={styles.input}
            placeholder="Nguyễn Thị B - 0909000000"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Địa chỉ</Text>
          <TextInput
            value={form.address}
            onChangeText={(value) => updateField('address', value)}
            style={[styles.input, styles.multilineInput]}
            multiline
            placeholder="Địa chỉ liên hệ"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Tiền sử bệnh / dị ứng</Text>
          <TextInput
            value={form.medicalHistory}
            onChangeText={(value) => updateField('medicalHistory', value)}
            style={[styles.input, styles.multilineInput]}
            multiline
            placeholder="Ví dụ: dị ứng penicillin, hen suyễn..."
            placeholderTextColor="#94a3b8"
          />
        </View>

        <Pressable
          style={[styles.saveButton, saving && styles.buttonDisabled]}
          onPress={save}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditMode ? 'Lưu thay đổi' : 'Thêm hồ sơ'}
            </Text>
          )}
        </Pressable>

        {isEditMode && (
          <Pressable
            style={[styles.deleteButton, saving && styles.buttonDisabled]}
            onPress={remove}
            disabled={saving}
          >
            <Text style={styles.deleteButtonText}>Xóa hồ sơ</Text>
          </Pressable>
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
  content: { padding: 16, paddingTop: 0, paddingBottom: 32 },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  errorText: { color: '#991b1b', fontSize: 13, fontWeight: '700' },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  label: {
    marginTop: 14,
    marginBottom: 6,
    color: '#475569',
    fontSize: 13,
    fontWeight: '800',
  },
  input: {
    minHeight: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '600',
  },
  multilineInput: {
    minHeight: 90,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  segmentGroup: { flexDirection: 'row', gap: 8 },
  segment: {
    flex: 1,
    minHeight: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  segmentActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
  },
  segmentText: { color: '#475569', fontSize: 13, fontWeight: '800' },
  segmentTextActive: { color: '#fff' },
  saveButton: {
    marginTop: 16,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  deleteButton: {
    marginTop: 12,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: { color: '#b91c1c', fontSize: 14, fontWeight: '800' },
  buttonDisabled: { opacity: 0.7 },
});
