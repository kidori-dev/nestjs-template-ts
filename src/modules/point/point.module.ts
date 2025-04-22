import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointEntity } from './entities/point.entity';
import { PointLogEntity } from './entities/point-log.entity';
import { PointAdminController } from './point.admin-controller';
import { PointUserController } from './point.user-controller';
import { AssetModule } from '../asset/asset.module';

@Module({
  imports: [TypeOrmModule.forFeature([PointEntity, PointLogEntity]), AssetModule],
  controllers: [PointAdminController, PointUserController],
  providers: [PointService],
  exports: [PointService],
})
export class PointModule {}
