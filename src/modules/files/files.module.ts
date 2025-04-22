import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [FilesController],
  providers: [
    FilesService,
    {
      provide: 'S3_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          region: configService.get('file.awsS3Region', { infer: true }),
          credentials: {
            accessKeyId: configService.getOrThrow('file.accessKeyId', { infer: true }),
            secretAccessKey: configService.getOrThrow('file.secretAccessKey', { infer: true }),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['S3_CLIENT', FilesService],
})
export class FilesModule {}
