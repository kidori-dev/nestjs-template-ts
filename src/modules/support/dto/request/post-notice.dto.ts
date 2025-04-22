import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PostNoticeDto {
  @ApiProperty({
    example: '제목',
    description: '제목',
    required: true,
    maxLength: 200,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: '내용',
    description: '내용',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
