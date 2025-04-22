import { Module } from '@nestjs/common';
import { AppInfoService } from './app-info.service';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppInfoEntity } from './entities/app-info.entity';
import { AppInfoController } from './app-info.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AppInfoEntity])],
  controllers: [AppInfoController],
  providers: [IsExist, IsNotExist, AppInfoService],
  exports: [AppInfoService],
})
export class AppInfoModule {}
