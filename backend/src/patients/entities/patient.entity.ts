import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity'; // Đường dẫn tới Entity User của bạn

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'full_name' })
  fullName!: string;

  @Column({ name: 'patient_code', unique: true })
  patientCode!: string; // Mã bệnh nhân (Ví dụ: BN-2026-8899)

  @Column({ nullable: true })
  phone!: string;

  @Column({ type: 'date', nullable: true })
  dob!: string; // Ngày sinh

  @Column({ nullable: true })
  gender!: string;

  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
