import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, Validate } from 'class-validator';
import dayjs from 'dayjs';
import { IsNotExist } from '../../../../utils/validators/is-not-exists.validator';
import { customError } from '../../../../constants/errors';

export class PostUserUserDto {
  @ApiProperty({
    example: `customer_${dayjs().format('MMDDHHmmss')}`,
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
    example: '레퍼럴 코드 (유저초대코드)',
    description: '레퍼럴 코드 (유저초대코드)',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  referrerCode: string;

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
    example: null,
    description: '프로필 이미지 파일 아이디',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  photoId?: string;
}
