import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class PatchNoticeDto {
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
    example: '제목',
    description: '제목',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: '내용',
    description: '내용',
    required: false,
  })
  @IsOptional()
  @IsString()
  content: string;
}
