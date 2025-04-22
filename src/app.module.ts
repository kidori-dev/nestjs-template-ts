import { Module } from '@nestjs/common';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import appConfig from './config/app.config';
import fileConfig from './config/file.config';
import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { HeaderResolver } from 'nestjs-i18n';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { AllConfigType } from './config/config.type';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import mailConfig from './config/mail.config';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { HealthModule } from './modules/health/health.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { AppInfoModule } from './modules/app-info/app-info.module';
import { AssetModule } from './modules/asset/asset.module';
import { PointModule } from './modules/point/point.module';
import { SupportModule } from './modules/support/support.module';

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
        return addTransactionalDataSource(new DataSource(options)).initialize();
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
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"API " ${configService.get('mail.user', {
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

    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    AssetModule,
    PointModule,
    SupportModule,
    AppInfoModule,
    // FilesModule,
    HealthModule,
  ],
})
export class AppModule {}
