import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';

import { Repository } from 'typeorm';
import { EmailCode } from './entities/email-code.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { randomStr } from '../../utils/helper';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService<AllConfigType>,
    @InjectRepository(EmailCode)
    private emailCodeRepository: Repository<EmailCode>,
  ) {}

  async sendCodeMail(to: string, code: string): Promise<void> {
    return await this.mailerService.sendMail({
      to: to,
      subject: 'TrackingSystem: Email verification ✔',
      template: 'email-confirm',
      context: {
        code: code,
      },
    });
  }

  async sendEmailCode(email: string): Promise<void> {
    const randomCode = randomStr(3).toUpperCase();
    await this.emailCodeRepository.save(
      this.emailCodeRepository.create({
        email: email,
        code: randomCode,
      }),
    );
    await this.sendCodeMail(email, randomCode);
  }
}
