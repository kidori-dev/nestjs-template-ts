import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class AdminLoginDto {
  @ApiProperty({
    example: 'admin',
    description: '문자열, 최대길이 50, lowerCase 로 변환해서 사용 중',
    maxLength: 50,
  })
  @Transform(lowerCaseTransformer)
  @IsString()
  @MaxLength(50)
  loginId: string;

  @ApiProperty({
    example: '1234',
    description: '문자열, 최대길이 255',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  password: string;
}
