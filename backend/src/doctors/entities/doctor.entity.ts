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

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'full_name' })
  fullName!: string;

  @Column()
  specialty!: string; // Chuyên khoa (Ví dụ: Răng-Hàm-Mặt, Tim mạch, Nhi khoa)

  @Column({ nullable: true })
  degree!: string; // Học vị (Ví dụ: Thạc sĩ, Bác sĩ CKI, PGS.TS)

  @Column({ nullable: true })
  phone!: string;

  @Column({ name: 'room_number', nullable: true })
  roomNumber!: string; // Phòng khám (Ví dụ: Phòng 102, Tầng 1)

  @Column({ type: 'text', nullable: true })
  bio!: string; // Tiểu sử ngắn gọn của bác sĩ

  // Liên kết 1-1 với tài khoản User hệ thống
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
