import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity'; // Đường dẫn tới Entity User có sẵn của bạn
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 1. Lấy thông tin tài khoản cơ bản của User đang đăng nhập
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        roleId: true,
        createdAt: true,
      }, // Không lấy mật khẩu gửi về
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản người dùng!');
    }
    return user;
  }

  // 2. Cập nhật tài khoản (Đổi mật khẩu / Email)
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản!');
    }

    // Nếu người dùng thay đổi mật khẩu -> Cần băm (Hash) lại bảo mật
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  // 3. Xóa tài khoản (Dành cho Admin hoặc khi hủy tài khoản)
  async remove(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản để xóa!');
    }
    await this.userRepository.remove(user);
    return { message: 'Xóa tài khoản thành công!' };
  }
}
