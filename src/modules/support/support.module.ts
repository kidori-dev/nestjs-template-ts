import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportUserController } from './support.user-controller';
import { SupportAdminController } from './support.admin-controller';
import { InquiryEntity } from './entities/inquiry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeEntity } from './entities/notice.entity';
import { SupportGuestController } from './support.guest-controller';
import { PopupEntity } from './entities/popup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InquiryEntity, NoticeEntity, PopupEntity])],
  controllers: [SupportAdminController, SupportUserController, SupportGuestController],
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule {}
