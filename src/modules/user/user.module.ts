import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserUserController } from './user.user-controller';
import { UserAdminController } from './user.admin-controller';
import { AssetModule } from '../asset/asset.module';
import { PointModule } from '../point/point.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AssetModule, PointModule],
  controllers: [UserAdminController, UserUserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
