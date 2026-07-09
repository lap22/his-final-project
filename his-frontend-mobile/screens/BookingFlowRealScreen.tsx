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
  BookingDoctor,
  BookingSpecialty,
  createBookingAppointment,
  getBookingDoctors,
  getBookingSpecialties,
  getDoctorTimeSlots,
  getHospitals,
  Hospital,
  TimeSlot,
} from '@/services/booking.service';
import { getPatients, PatientProfile } from '@/services/patient.service';

const steps = ['Bệnh viện', 'Chuyên khoa', 'Bác sĩ', 'Thời gian'];

function todayValue() {
  return new Date().toISOString().slice(0, 10);
}

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function SelectCard({
  title,
  subtitle,
  selected,
  onPress,
}: {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.selectCard, selected && styles.selectCardActive]} onPress={onPress}>
      <View style={styles.selectTextGroup}>
        <Text style={[styles.selectTitle, selected && styles.selectTitleActive]}>{title}</Text>
        {!!subtitle && (
          <Text style={[styles.selectSubtitle, selected && styles.selectSubtitleActive]}>
            {subtitle}
          </Text>
        )}
      </View>
      {selected && <Ionicons name="checkmark-circle" size={22} color="#0284c7" />}
    </Pressable>
  );
}

function EmptyStep({ text }: { text: string }) {
  return (
    <View style={styles.emptyBox}>
      <Ionicons name="calendar-outline" size={34} color="#0284c7" />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value || 'Chưa chọn'}</Text>
    </View>
  );
}

export default function BookingFlowScreen() {
  const [step, setStep] = useState(0);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [specialties, setSpecialties] = useState<BookingSpecialty[]>([]);
  const [doctors, setDoctors] = useState<BookingDoctor[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<BookingSpecialty | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<BookingDoctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [selectedDate] = useState(todayValue());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(selectedHospital);
    if (step === 1) return Boolean(selectedSpecialty);
    if (step === 2) return Boolean(selectedDoctor);
    return Boolean(selectedSlot && selectedPatient);
  }, [selectedDoctor, selectedHospital, selectedPatient, selectedSlot, selectedSpecialty, step]);

  const loadStepData = useCallback(async (currentStep = step, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      if (currentStep === 0) {
        setHospitals(await getHospitals());
      }

      if (currentStep === 1 && selectedHospital) {
        setSpecialties(await getBookingSpecialties(selectedHospital.id));
      }

      if (currentStep === 2 && selectedHospital && selectedSpecialty) {
        setDoctors(await getBookingDoctors(selectedHospital.id, selectedSpecialty.id));
      }

      if (currentStep === 3 && selectedDoctor) {
        const [slotData, patientData] = await Promise.all([
          getDoctorTimeSlots(selectedDoctor.id, selectedDate),
          getPatients(),
        ]);
        setSlots(slotData);
        setPatients(patientData);
      }
    } catch {
      setError('Không thể tải dữ liệu đặt lịch.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDoctor, selectedHospital, selectedSpecialty, selectedDate, step]);

  useEffect(() => {
    loadStepData(step);
  }, [loadStepData, step]);

  const goBack = useCallback(() => {
    if (step === 0) {
      router.back();
      return;
    }

    setStep((current) => current - 1);
  }, [step]);

  const confirmBooking = useCallback(async () => {
    if (!selectedDoctor || !selectedSlot || !selectedPatient) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createBookingAppointment({
        patientProfileId: selectedPatient.id,
        doctorId: selectedDoctor.id,
        scheduleId: selectedSlot.scheduleId,
        appointmentDate: selectedSlot.appointmentDate,
        reason: 'Đặt lịch khám qua ứng dụng',
      });

      alert('Đặt lịch thành công.');
      router.replace('/home' as never);
    } catch {
      setError('Không thể tạo lịch hẹn.');
    } finally {
      setSubmitting(false);
    }
  }, [selectedDoctor, selectedPatient, selectedSlot]);

  const renderListRefresh = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={() => loadStepData(step, true)}
      tintColor="#0284c7"
      colors={['#0284c7']}
    />
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.stateBox}>
          <ActivityIndicator size="large" color="#0284c7" />
          <Text style={styles.stateText}>Đang tải dữ liệu...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateBox}>
          <Text style={styles.errorTitle}>Không tải được dữ liệu</Text>
          <Text style={styles.emptyText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={() => loadStepData(step)}>
            <Text style={styles.retryText}>Thử lại</Text>
          </Pressable>
        </View>
      );
    }

    if (step === 0) {
      return (
        <FlatList
          data={hospitals}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <SelectCard
              title={item.name}
              subtitle={item.address ?? undefined}
              selected={selectedHospital?.id === item.id}
              onPress={() => {
                setSelectedHospital(item);
                setSelectedSpecialty(null);
                setSelectedDoctor(null);
                setSelectedSlot(null);
              }}
            />
          )}
          ListEmptyComponent={<EmptyStep text="Chưa có bệnh viện khả dụng." />}
          refreshControl={renderListRefresh}
        />
      );
    }

    if (step === 1) {
      return (
        <FlatList
          data={specialties}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SelectCard
              title={item.name}
              subtitle={`${item.doctorCount ?? 0} bác sĩ`}
              selected={selectedSpecialty?.id === item.id}
              onPress={() => {
                setSelectedSpecialty(item);
                setSelectedDoctor(null);
                setSelectedSlot(null);
              }}
            />
          )}
          ListEmptyComponent={<EmptyStep text="Chưa có chuyên khoa phù hợp." />}
          refreshControl={renderListRefresh}
        />
      );
    }

    if (step === 2) {
      return (
        <FlatList
          data={doctors}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <SelectCard
              title={item.fullName}
              subtitle={item.qualification || item.specialtyName}
              selected={selectedDoctor?.id === item.id}
              onPress={() => {
                setSelectedDoctor(item);
                setSelectedSlot(null);
              }}
            />
          )}
          ListEmptyComponent={<EmptyStep text="Chưa có bác sĩ phù hợp." />}
          refreshControl={renderListRefresh}
        />
      );
    }

    return (
      <ScrollView refreshControl={renderListRefresh}>
        <Text style={styles.groupTitle}>Khung giờ ngày {selectedDate}</Text>
        {slots.length === 0 ? (
          <EmptyStep text="Chưa có lịch trống cho ngày này." />
        ) : (
          slots.map((slot) => (
            <SelectCard
              key={slot.id}
              title={`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}
              subtitle={`Còn ${slot.availableCount} lượt`}
              selected={selectedSlot?.id === slot.id}
              onPress={() => setSelectedSlot(slot)}
            />
          ))
        )}

        <Text style={styles.groupTitle}>Thành viên khám</Text>
        {patients.length === 0 ? (
          <EmptyStep text="Chưa có hồ sơ bệnh nhân." />
        ) : (
          patients.map((patient) => (
            <SelectCard
              key={patient.id}
              title={patient.fullName}
              subtitle={patient.insuranceNumber ? `BHYT: ${patient.insuranceNumber}` : undefined}
              selected={selectedPatient?.id === patient.id}
              onPress={() => setSelectedPatient(patient)}
            />
          ))
        )}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Tóm tắt đặt lịch</Text>
          <SummaryRow label="Bệnh viện" value={selectedHospital?.name} />
          <SummaryRow label="Chuyên khoa" value={selectedSpecialty?.name} />
          <SummaryRow label="Bác sĩ" value={selectedDoctor?.fullName} />
          <SummaryRow
            label="Ngày giờ"
            value={selectedSlot ? `${selectedDate} ${formatTime(selectedSlot.startTime)}` : undefined}
          />
          <SummaryRow label="Thành viên khám" value={selectedPatient?.fullName} />
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={goBack}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </Pressable>
        <Text style={styles.title}>Đặt lịch khám</Text>
      </View>

      <View style={styles.stepIndicator}>
        {steps.map((label, index) => {
          const active = index === step;
          const done = index < step;

          return (
            <View key={label} style={styles.stepItem}>
              <View style={[styles.stepDot, (active || done) && styles.stepDotActive]}>
                <Text style={[styles.stepNumber, (active || done) && styles.stepNumberActive]}>
                  {index + 1}
                </Text>
              </View>
              <Text style={[styles.stepLabel, active && styles.stepLabelActive]} numberOfLines={1}>
                {label}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.body}>{renderContent()}</View>

      <View style={styles.footer}>
        {step < 3 ? (
          <Pressable
            style={[styles.primaryButton, !canContinue && styles.buttonDisabled]}
            disabled={!canContinue}
            onPress={() => setStep((current) => current + 1)}
          >
            <Text style={styles.primaryButtonText}>Tiếp tục</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.primaryButton, (!canContinue || submitting) && styles.buttonDisabled]}
            disabled={!canContinue || submitting}
            onPress={confirmBooking}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Xác nhận đặt lịch</Text>
            )}
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
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
  stepIndicator: { flexDirection: 'row', paddingHorizontal: 12, paddingBottom: 12, gap: 6 },
  stepItem: { flex: 1, alignItems: 'center' },
  stepDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e2e8f0',
  },
  stepDotActive: { backgroundColor: '#0284c7' },
  stepNumber: { color: '#64748b', fontSize: 12, fontWeight: '800' },
  stepNumberActive: { color: '#fff' },
  stepLabel: { marginTop: 5, color: '#64748b', fontSize: 11, fontWeight: '700' },
  stepLabelActive: { color: '#0284c7' },
  body: { flex: 1, paddingHorizontal: 16 },
  stateBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  stateText: { marginTop: 12, color: '#475569', fontSize: 14, fontWeight: '600' },
  errorTitle: { color: '#991b1b', fontSize: 18, fontWeight: '800' },
  selectCard: {
    minHeight: 72,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectCardActive: { borderColor: '#0284c7', backgroundColor: '#f0f9ff' },
  selectTextGroup: { flex: 1 },
  selectTitle: { color: '#0f172a', fontSize: 15, fontWeight: '800' },
  selectTitleActive: { color: '#0369a1' },
  selectSubtitle: { marginTop: 4, color: '#64748b', fontSize: 13, fontWeight: '600' },
  selectSubtitleActive: { color: '#0369a1' },
  emptyBox: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { marginTop: 8, color: '#64748b', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  retryButton: {
    marginTop: 18,
    backgroundColor: '#0284c7',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  retryText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  groupTitle: { marginTop: 14, marginBottom: 10, color: '#0f172a', fontSize: 16, fontWeight: '800' },
  summaryCard: {
    marginTop: 14,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
  },
  summaryTitle: { color: '#0f172a', fontSize: 16, fontWeight: '800' },
  summaryRow: { marginTop: 10 },
  summaryLabel: { color: '#64748b', fontSize: 12, fontWeight: '800' },
  summaryValue: { marginTop: 3, color: '#0f172a', fontSize: 14, fontWeight: '700' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#e2e8f0', backgroundColor: '#fff' },
  primaryButton: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  buttonDisabled: { opacity: 0.45 },
});
