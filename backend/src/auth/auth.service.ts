import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface User {
  id: string;
  email: string;
  password: string; // Lưu mật khẩu đã mã hóa
  name: string;
  phone: string;
  refreshToken?: string;
}
@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    // 1. Kiểm tra email trùng lặp
    const userExists = this.users.find((u) => u.email === dto.email);
    if (userExists) {
      throw new BadRequestException('Email này đã được sử dụng!');
    }

    // 2. Mã hóa mật khẩu (Salt round = 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    const nextId =
      this.users.length > 0
        ? Number(this.users[this.users.length - 1].id) + 1
        : 1;
    // 3. Lưu vào Database
    const newUser = {
      id: nextId.toString(),
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword, // Lưu mật khẩu đã mã hóa
      name: dto.name,
    };
    this.users.push(newUser);

    // 4. Trả về thông tin (Không trả về password)
    return {
      message: 'Đăng ký tài khoản thành công!',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    };
  }

  async login(dto: LoginDto) {
    // 1. Tìm user theo email
    const user = this.users.find((u) => u.email === dto.email);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    // 2. So sánh mật khẩu client gửi lên với mật khẩu đã mã hóa trong DB
    const isPasswordMatch = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    // 3. Tạo cặp JWT Token với thời hạn khác nhau hoàn toàn
    const payload = { sub: user.id };

    const [accessToken, refreshToken] = await Promise.all([
      // Access Token: Hạn ngắn (15 phút) dùng để đi gọi các API khác
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),

      // Refresh Token: Hạn dài (7 ngày) chỉ dùng để đi đổi token mới
      this.jwtService.signAsync({ sub: user.id }, { expiresIn: '7d' }),
    ]);

    // 4. QUAN TRỌNG: Lưu lại Refresh Token vừa tạo vào DB (ở đây là mảng giả lập)
    const userIndex = this.users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      this.users[userIndex].refreshToken = refreshToken; // Lưu lại để sau này đối chiếu
    }

    // 5. Trả về cho Client
    return {
      message: 'Đăng nhập thành công!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone, // Trả thêm phone nếu bạn muốn hiển thị ở giao diện
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
