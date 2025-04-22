import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { AllConfigType } from 'src/config/config.type';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Transactional } from 'typeorm-transactional';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { DataNotFoundException } from '../../exceptions/exception-422';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
  ) {}

  @Transactional()
  async uploadFileS3(file: Express.Multer.File): Promise<any> {
    if (!file) throw new DataNotFoundException();

    const bucket = this.configService.getOrThrow('file.awsDefaultS3Bucket', { infer: true });
    const region = this.configService.get('file.awsS3Region', { infer: true });
    const key = `${randomStringGenerator()}.${file.originalname.split('.').pop()?.toLowerCase()}`;
    const path = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    const originalName = Buffer.from(file.originalname, 'ascii').toString('utf-8');
    const params = {
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    await this.s3Client.send(new PutObjectCommand(params));
    return await this.fileRepository.save(
      this.fileRepository.create({
        path: path,
        uploadName: key,
        originalName: originalName,
        size: file.size,
        contentType: file.mimetype,
      }),
    );
  }

  @Transactional()
  async deleteFileS3(id: string): Promise<any> {
    // S3 파일 삭제
    const bucket = this.configService.getOrThrow('file.awsDefaultS3Bucket', { infer: true });
    const file = await this.fileRepository.findOne({ where: { id: id } });
    if (!file) throw new DataNotFoundException();
    const uploadName = file.uploadName;
    await file.softRemove();
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: uploadName, // S3 파일 경로
    });
    await this.s3Client.send(deleteCommand);
  }
}
