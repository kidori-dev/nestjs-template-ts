import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetEntity } from './entities/asset.entity';
import { AssetLogEntity } from './entities/asset-log.entity';
import { AssetAdminController } from './asset.admin-controller';
import { AssetUserController } from './asset.user-controller';
import { AssetTxEntity } from './entities/asset-tx.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([AssetEntity, AssetLogEntity, AssetTxEntity])],
  controllers: [AssetAdminController, AssetUserController],
  providers: [IsExist, IsNotExist, AssetService],
  exports: [AssetService],
})
export class AssetModule {}
