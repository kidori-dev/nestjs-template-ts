import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppInfoEntity } from './entities/app-info.entity';
import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';

@Injectable()
export class AppInfoService {
  constructor(
    @InjectRepository(AppInfoEntity)
    private readonly appInfoRepository: Repository<AppInfoEntity>,
  ) {}

  async getBankAccount(): Promise<AppInfoEntity> {
    const item = await this.appInfoRepository.findOne({ where: { name: 'ACCOUNT' } });
    if (!item) throw new UnprocessableEntityException('app_info 에 은행계좌가 누락되었습니다.');
    return item;
  }
}
