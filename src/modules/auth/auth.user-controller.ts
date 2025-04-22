import { Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalUserAuthGuard } from 'src/modules/auth/session/local-auth.guard';
import { UserSessionDto } from './dto/response/user.session.dto';
import { ICustomRequest } from '../../utils/types/custom-request.interface';
import { UserAuthGuard } from './session/user-auth.guard';
import { User } from '../../utils/decorators/user.decorator';
import { IUserSession } from '../../utils/types/auth-user.interface';
import { UserLoginDto } from './dto/request/user-login.dto';
import { Request as expressRequest } from 'express';
import { getClientIp } from 'request-ip';
import { UserService } from '../user/user.service';
import dayjs from 'dayjs';
import { PatchUserUserDto } from '../user/dto/request/patch-user.user-dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('로그인 (유저)')
@Controller({
  path: 'user/auth',
  version: '1',
})
export class AuthUserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @UseGuards(LocalUserAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '로그인',
    description: `로그인`,
  })
  @ApiBody({
    description: '로그인 정보',
    type: UserLoginDto,
  })
  async loginPost(@Req() req: expressRequest, @User() user: IUserSession) {
    const forwardedIp = getClientIp(req);
    const updateData: PatchUserUserDto = { lastLogin: dayjs().toDate() };
    if (forwardedIp) updateData.lastIp = forwardedIp;
    await this.userService.updateByUser(updateData, user.id);
    return user;
  }

  @Get('logout')
  @UseGuards(UserAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '로그아웃',
    description: `세션 로그아웃`,
  })
  logoutGet(@Req() req: ICustomRequest) {
    req.logOut(function () {
      return true;
    });
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserAuthGuard)
  @ApiOperation({
    summary: '세션 체크',
    description: `세션 체크`,
  })
  async meGet(@Req() req: ICustomRequest, @User() user: IUserSession): Promise<UserSessionDto> {
    // return await this.authService.validateSessionUser(req.user.loginId);
    const item = await this.authService.validateSessionUser(user.loginId);
    const data = req.session;
    const sessionTime = Number(process.env.SESSION_MAX_AGE ?? 3600);
    data.expires = new Date(Date.now() + sessionTime);
    data.cookie.maxAge = sessionTime * 1000;
    req.session.touch();
    data.save();
    return plainToInstance(UserSessionDto, item);
  }
}
