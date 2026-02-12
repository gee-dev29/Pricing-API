import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { comparePassword } from '../Utils/utils';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) { }

  async register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // For now, return the user object (excluding password)
    // In a real app, you'd return a JWT token here
    const { password: _password, ...userObj } = user.toObject();
    return userObj;
  }
}
