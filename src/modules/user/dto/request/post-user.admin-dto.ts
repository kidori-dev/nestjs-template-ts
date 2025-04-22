import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, Validate } from 'class-validator';
import dayjs from 'dayjs';
import { IsNotExist } from '../../../../utils/validators/is-not-exists.validator';
import { customError } from '../../../../constants/errors';

export class PostUserAdminDto {
  @ApiProperty({
    example: `cp_${dayjs().format('MMDDHHmmss')}`,
    description: '로그인 아이디',
    required: true,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @Validate(IsNotExist, ['UserEntity', 'loginId'], { message: customError.AlreadyRegistered })
  @MaxLength(50)
  loginId: string;

  @ApiProperty({
    example: '유저이름',
    description: '이름',
    required: true,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'test@example.com',
    description: '이메일',
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    example: '1234',
    description: '비밀번호',
    required: true,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  password: string;

  @ApiProperty({
    example: 1,
    description: '활성화 여부 (1:활성화, 2:비활성화)',
    required: true,
  })
  @IsNotEmpty()
  @IsIn([1, 2])
  isActive: number;

  @ApiProperty({
    example: null,
    description: '프로필 이미지 파일 아이디',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  photoId?: string;

  @ApiProperty({
    example: '관리자 메모입니다.',
    description: '메모',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  memo?: string;
}
