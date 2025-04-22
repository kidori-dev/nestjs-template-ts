import { registerAs } from '@nestjs/config';
import { AuthConfig } from './config.type';
import { IsInt } from 'class-validator';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsInt()
  AUTH_SESSION_MAX_AGE: number;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    sessionMaxAge: Number(process.env.AUTH_SESSION_MAX_AGE) ?? 3600,
  };
});
