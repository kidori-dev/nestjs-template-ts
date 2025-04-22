import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';
import { initSession } from './config/session';
import bodyParser from 'body-parser';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  initSession(app);
  app.use(bodyParser.text());
  app.enableShutdownHooks();
  app.setGlobalPrefix(configService.getOrThrow('app.apiPrefix', { infer: true }), {
    exclude: ['/'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const nodeEnv = configService.getOrThrow('app.nodeEnv', { infer: true });

  if (nodeEnv !== 'production') {
    const options = new DocumentBuilder()
      .setTitle(process.env.APP_NAME || 'API')
      .setDescription(`${process.env.APP_NAME} 문서`)
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-server/docs', app, document, {
      jsonDocumentUrl: 'api-server/json',
      swaggerOptions: {
        defaultModelRendering: 'model', // Request Body 기본 탭을 Schema로 설정
        // defaultModelsExpandDepth: 1, // 모든 모델 펼침
        defaultModelExpandDepth: 2, // 각 모델의 속성을 펼쳐서 표시
        persistAuthorization: configService.getOrThrow('app.apiPrefix', { infer: true }) !== 'production', // 인증 상태를 유지
      },
    });
  }

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}

void bootstrap();
