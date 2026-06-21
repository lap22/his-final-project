import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users') // Tên bảng trong Database
export class User {
  @PrimaryGeneratedColumn() // Tự động tăng số (1, 2, 3...) như bạn muốn ở bước trước!
  id!: number;

  @Column({ unique: true }) // Email không được trùng
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true, name: 'refresh_token', type: 'text' })
  refreshToken?: string;

  @Column({ name: 'role_id', default: 3 })
  roleId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
