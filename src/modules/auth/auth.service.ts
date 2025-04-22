import { Injectable } from '@nestjs/common';

import { IncorrectPasswordException } from '../../exceptions/exception-422';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';
import { UserService } from '../user/user.service';
import { AdminService } from '../admin/admin.service';
import { IsActiveEnum } from '../../constants/enums';
import { AdminEntity } from '../admin/entities/admin.entity';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<AllConfigType, true>,
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {}

  async validateLoginUser(loginId: string, password: string): Promise<UserEntity> {
    const user = await this.userService.getUser({ loginId: loginId, isActive: IsActiveEnum.ACTIVE });
    // const isValidPassword = await bcrypt.compare(password, user.password);
    if (password !== user.password) throw new IncorrectPasswordException();
    return user;
  }

  async validateSessionUser(loginId: string): Promise<UserEntity> {
    return await this.userService.getUser({ loginId: loginId, isActive: IsActiveEnum.ACTIVE });
  }

  async validateLoginAdmin(loginId: string, password: string): Promise<AdminEntity> {
    const admin = await this.adminService.getAdmin({ loginId: loginId });
    if (password !== admin.password) throw new IncorrectPasswordException();
    return admin;
  }

  async validateSessionAdmin(loginId: string): Promise<AdminEntity> {
    return await this.adminService.getAdmin({ loginId: loginId });
  }

  getSessionMaxAge(): string | number {
    return this.configService.get('auth.sessionMaxAge', { infer: true });
  }
}
