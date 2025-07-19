import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findByCode(code: string): Promise<Role> {
    const response = await this.roleRepository.findOne({
      where: {
        code: code,
        is_deleted: false
      },
    });
    if (!response) {
      throw new NotFoundException('Role not found');
    }
    return response;
  }

  async findById(id: number): Promise<Role> {
    const response = await this.roleRepository.findOne({
      where: {
        id: id,
        is_deleted: false
      },
    });
    if (!response) {
      throw new NotFoundException('Role not found');
    }
    return response;
  }

  async create(payload: CreateRoleDto) {
    const role = this.roleRepository.create(payload);
    return await this.roleRepository.save(role);
  }
}
