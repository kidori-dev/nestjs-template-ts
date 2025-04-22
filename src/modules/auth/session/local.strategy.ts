import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import e from 'express';
import { plainToInstance } from 'class-transformer';
import { AdminSessionDto } from '../dto/response/admin.session.dto';
import { UserSessionDto } from '../dto/response/user.session.dto';

@Injectable()
export class LocalUserStrategy extends PassportStrategy(Strategy, 'local-user') {
  constructor(private readonly authService: AuthService) {
    // constructor() {
    super({ usernameField: 'loginId', passwordField: 'password' });
  }

  authenticate(req: e.Request, options?: any) {
    req.logOut(function () {
      return true;
    });
    super.authenticate(req, options);
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateLoginUser(username, password);
    const result = plainToInstance(UserSessionDto, user);
    return { ...result, loginType: 'user' };
  }
}

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(Strategy, 'local-admin') {
  constructor(private readonly authService: AuthService) {
    // constructor() {
    super({ usernameField: 'loginId', passwordField: 'password' });
  }

  authenticate(req: e.Request, options?: any) {
    req.logOut(function () {
      return true;
    });
    super.authenticate(req, options);
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateLoginAdmin(username, password);
    const result = plainToInstance(AdminSessionDto, user);
    return { ...result, loginType: 'admin' };
  }
}
