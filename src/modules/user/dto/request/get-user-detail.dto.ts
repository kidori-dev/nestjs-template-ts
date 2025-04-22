import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetUserDetailDto {
  @ApiProperty({
    description: '유저 정보 조회 // 문자열',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  referrerUserId?: string;
}
