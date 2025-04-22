import { Module } from '@nestjs/common';

import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { AdminEntity } from './entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  controllers: [],
  providers: [IsExist, IsNotExist, AdminService],
  exports: [AdminService],
})
export class AdminModule {}
