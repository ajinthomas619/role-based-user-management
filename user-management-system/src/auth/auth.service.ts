import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JWTPayload, JWTResponse, LoginDto, SignUpDto } from './dto/auth.dto';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtSevice: JwtService,
  ) {}
  async login(payload: LoginDto): Promise<JWTResponse> {
    try {
      const expiresIn = process.env.JWT_TOKEN_EXPIRE || '7h';
      const user = await this.userRepository.findOne({
        where: {
          email: payload.email,
          is_deleted: false,
        },
        relations: ['role', 'company'],
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPassworValid = await this.comparePassword(
        payload.password,
        user.password,
      );
      if (!isPassworValid) {
        throw new UnauthorizedException('Invalid password');
      }
      const accessToken = this.jwtSevice.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role.name,
          company: user.company.name,
        },
        { expiresIn },
      );
      const response = {
        id: user.id,
        token: accessToken,
        role: user.role.name,
        company: user.company.name,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }
  async signUp(
    payload: SignUpDto,
  ): Promise<{ success: boolean; userId: number }> {
    try {
      if (payload.password !== payload.confirm_password) {
        throw new UnauthorizedException(
          'Password and confirm password do not match',
        );
      }
      const existingUser = await this.userRepository.findOne({
        where: { email: payload.email },
      });
      if (existingUser) {
        throw new UnauthorizedException('Email already in use');
      }
      const hashedPassword = await bcrypt.hash(payload.password, 10);
      const requestPayload = {
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        password: hashedPassword,
        phone_no: payload.phone_no || null,
        role_id: payload.role_id,
        company_id: payload.company_id,
      };
      const userData = this.userRepository.create(requestPayload);
      const savedUserData = await this.userRepository.save(userData);
      if (!savedUserData) {
        throw new InternalServerErrorException(
          'oops something wrong has happened',
        );
      }
      return { success: true, userId: userData.id };
    } catch (error) {
      throw error;
    }
  }

  async getUserDetailsFromToken(
    accessToken: string,
  ): Promise<Partial<User> | null> {
    try {
      const decodedToken = this.jwtSevice.verify<JWTPayload>(accessToken, {
        secret: process.env.JWT_SECRET,
      });

      const userId = decodedToken.sub;

      const user = await this.userRepository.findOne({
        where: {
          id: userId,
          is_deleted: false,
        },
        relations: ['role', 'company'],
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const response = {
        id: user.id,
        email: user.email,
        roleName: user.role?.name,
        companyName: user.company?.name,
      };

      return response;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new UnauthorizedException(
        `Error comparing password ${error.message}`,
      );
    }
  }
}
