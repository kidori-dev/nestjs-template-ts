import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { customError } from '../../../../constants/errors';
import { IsExist } from '../../../../utils/validators/is-exists.validator';

export class PostPopupDto {
  @ApiProperty({
    example: '내용',
    description: '내용',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: '1',
    description: '파일 아이디',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Validate(IsExist, ['FileEntity', 'id'], { message: customError.DataNotFound })
  fileId: string;
}
