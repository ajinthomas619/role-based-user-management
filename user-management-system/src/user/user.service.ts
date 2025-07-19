import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { createUserDto, GetUsersDto } from './dto/user.dto';
import { RoleService } from 'src/roles/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private roleService: RoleService,
  ) {}

  async createUser(payload: createUserDto, currentUser: User) {
    const caRole = await this.roleService.findByCode('CA');
    if (currentUser.role_id !== caRole.id) {
      throw new ForbiddenException('Only Company Admins can create users');
    }
    const existingUser = await this.userRepository.findOne({
      where: { email: payload.email, is_deleted: false },
    });
    if (existingUser) {
      throw new ForbiddenException('Email already exists');
    }
    const role = await this.roleService.findById(payload.role_id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = this.userRepository.create({
      ...payload,
      password: hashedPassword,
      company_id: currentUser.company_id,
      created_by: currentUser.id,
    });

    const savedUser = await this.userRepository.save(user);

    const { password, ...result } = savedUser;
    return result as User;
  }

  async findAll(
    getUsersDto: GetUsersDto,
    currentUser: User,
  ): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    const { page, limit, search } = getUsersDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.company', 'company')
      .where('user.company_id = :companyId', {
        companyId: currentUser.company_id,
      })
      .andWhere('user.is_deleted = :isDeleted', { isDeleted: false });

    if (search) {
      queryBuilder.andWhere(
        '(user.first_name LIKE :search OR user.last_name LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [users, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('user.created_at', 'DESC')
      .getManyAndCount();

    return {
      users: users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      }),
      total,
      page,
      limit,
    };
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, is_deleted: false },
      relations: ['role', 'company'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async softDelete(id: number, currentUser: User): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id, company_id: currentUser.company_id, is_deleted: false },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const caRole = await this.roleService.findByCode('CA');
    if (currentUser.role_id !== caRole.id) {
      throw new ForbiddenException('Only Company Admins can delete users');
    }

    await this.userRepository.update(id, { is_deleted: true });
  }
}
