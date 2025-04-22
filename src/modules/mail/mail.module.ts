import { Module } from '@nestjs/common';

import { MailService } from './mail.service';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailCode } from './entities/email-code.entity';
@Module({
  imports: [TypeOrmModule.forFeature([EmailCode])],
  providers: [IsExist, IsNotExist, MailService],
  exports: [MailService],
})
export class MailModule {}
