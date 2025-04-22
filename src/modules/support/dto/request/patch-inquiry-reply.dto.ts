import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PatchInquiryReplyDto {
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
    example: '답변',
    description: '답변',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  reply: string;
}
