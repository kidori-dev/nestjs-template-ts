import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalAdminStrategy, LocalUserStrategy } from './session/local.strategy';
import { SessionSerializer } from './session/session.serializer';
import { UserModule } from '../user/user.module';
import { AuthAdminController } from './auth.admin-controller';
import { AuthUserController } from './auth.user-controller';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [PassportModule, PassportModule.register({ session: true }), UserModule, AdminModule],
  controllers: [AuthAdminController, AuthUserController],
  providers: [AuthService, LocalUserStrategy, LocalAdminStrategy, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}
