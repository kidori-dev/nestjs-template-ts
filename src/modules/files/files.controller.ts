import { Controller, Delete, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FilesService } from './files.service';
import { ImageFileInterceptor } from '../../interceptors/image-file.interceptor';

@ApiTags('파일')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(ImageFileInterceptor)
  @ApiOperation({
    summary: '파일 등록',
    description: `공통권한<br>파일 등록`,
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File | Express.MulterS3.File) {
    return this.filesService.uploadFileS3(file);
  }

  // 파일 삭제
  @Delete(':id')
  @ApiOperation({
    summary: '파일 삭제',
    description: `파일 삭제 기능`,
  })
  async deleteFile(@Param('id') id: string) {
    return this.filesService.deleteFileS3(id);
  }
}
