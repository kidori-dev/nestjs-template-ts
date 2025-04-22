import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';

@Injectable()
export class ImageFileInterceptor implements NestInterceptor {
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  private readonly maxFileSize = 120 * 1024 * 1024; // 120MB

  private multerOptions = {
    fileFilter: (req: any, file: any, callback: any) => {
      // MIME 타입 검사
      if (!this.allowedMimeTypes.includes(file.mimetype)) {
        new UnprocessableEntityException('unsupported file type');
      }
      callback(null, true);
    },
    limits: {
      fileSize: this.maxFileSize, // 최대 파일 크기 제한
    },
  };

  intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> | Observable<any> {
    const targetInterceptor = new (FileInterceptor('file', this.multerOptions))();
    return targetInterceptor.intercept(context, next);
  }
}
