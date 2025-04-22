import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { IsExist } from '../../../../utils/validators/is-exists.validator';
import { customError } from '../../../../constants/errors';

export class PatchPopupDto {
  @ApiProperty({
    example: '1',
    description: '아이디',
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    example: '내용',
    description: '내용',
    required: false,
  })
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty({
    example: '1',
    description: '파일 아이디',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Validate(IsExist, ['FileEntity', 'id'], { message: customError.DataNotFound })
  fileId: string;
}
