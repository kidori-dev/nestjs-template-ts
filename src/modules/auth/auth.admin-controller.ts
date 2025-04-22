import { Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAdminAuthGuard } from 'src/modules/auth/session/local-auth.guard';
import { ICustomRequest } from '../../utils/types/custom-request.interface';
import { Admin } from '../../utils/decorators/admin.decorator';
import { AdminSessionDto } from './dto/response/admin.session.dto';
import { AdminAuthGuard } from './session/admin-auth.guard';
import { IAdminSession } from '../../utils/types/auth-admin.interface';
import { AdminLoginDto } from './dto/request/admin-login.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('로그인 (어드민)')
@Controller({
  path: 'admin/auth',
  version: '1',
})
export class AuthAdminController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '로그인',
    description: `로그인`,
  })
  @ApiBody({
    description: '로그인 정보',
    type: AdminLoginDto,
  })
  loginPost(@Admin() admin: IAdminSession) {
    return admin;
  }

  @Get('logout')
  @UseGuards(AdminAuthGuard)
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
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: '세션 체크',
    description: `세션 체크`,
  })
  async meGet(@Req() req: ICustomRequest, @Admin() admin: IAdminSession): Promise<AdminSessionDto> {
    const item = await this.authService.validateSessionAdmin(admin.loginId);
    const data = req.session;
    const sessionTime = Number(process.env.SESSION_MAX_AGE ?? 3600);
    data.expires = new Date(Date.now() + sessionTime);
    data.cookie.maxAge = sessionTime * 1000;
    req.session.touch();
    data.save();
    return plainToInstance(AdminSessionDto, item);
  }
}
