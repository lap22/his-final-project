import { Patient } from 'src/patients/entities/patient.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'record_code', unique: true })
  recordCode!: string; // Mã bệnh án (Ví dụ: BA-2026-XXXX)

  @Column({ type: 'text' })
  diagnosis!: string; // Chẩn đoán bệnh chính

  @Column({ type: 'text', nullable: true })
  symptoms!: string; // Triệu chứng lâm sàng

  @Column({ type: 'text', nullable: true })
  treatmentPlan!: string; // Phác đồ điều trị

  @Column({ type: 'text', nullable: true })
  prescription!: string; // Đơn thuốc (Dạng text hoặc JSON)

  @Column({ type: 'text', nullable: true })
  notes!: string; // Ghi chú thêm của bác sĩ

  // Mối quan hệ: Một bệnh nhân có thể có nhiều hồ sơ bệnh án qua các lần khám
  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
