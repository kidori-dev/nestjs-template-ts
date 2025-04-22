import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DataNotFoundException } from '../../exceptions/exception-422';
import { AdminEntity } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  async getAdmin(condition: FindOptionsWhere<AdminEntity>): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOne({
      where: condition,
    });
    if (!admin) throw new DataNotFoundException();
    return admin;
  }
}
