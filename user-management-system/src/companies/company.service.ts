import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { createCompanyDto } from './dto/company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async findAll(): Promise<Company[]> {
    return this.companyRepository.find();
  }
  async findById(id: number): Promise<Company> {
    const response = await this.companyRepository.findOne({
      where: {
        id: id,
        is_deleted: false,
      },
    });
    if (!response) {
      throw new NotFoundException('Company not found');
    }
    return response;
  }

  async create(payload: createCompanyDto) {
    const company = this.companyRepository.create(payload);
    return await this.companyRepository.save(company);
  }
}
