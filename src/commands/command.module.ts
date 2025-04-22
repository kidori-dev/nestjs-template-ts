import { Module } from '@nestjs/common';
import databaseConfig from '../config/database.config';
import authConfig from '../config/auth.config';
import appConfig from '../config/app.config';
import fileConfig from '../config/file.config';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmConfigService } from '../database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';

import mailConfig from '../config/mail.config';
import { commands } from './index';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerModule } from '@nestjs-modules/mailer';
import { AllConfigType } from '../config/config.type';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { FilesModule } from '../modules/files/files.module';
import { AppInfoModule } from '../modules/app-info/app-info.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, fileConfig, mailConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),

    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        transport: {
          host: configService.get('mail.host', { infer: true }),
          port: configService.get('mail.port', { infer: true }),
          ignoreTLS: configService.get('mail.ignoreTLS', { infer: true }),
          secure: configService.get('mail.secure', { infer: true }),
          auth: {
            user: configService.get('mail.user', { infer: true }),
            pass: configService.get('mail.password', { infer: true }),
          },
        },
        defaults: {
          from: `"API" ${configService.get('mail.user', {
            infer: true,
          })}`,
        },
        preview: true,
        template: {
          dir: __dirname + '/mail',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    FilesModule,
    AppInfoModule,
  ],
  providers: [...commands],
})
export class CommandModule {}
