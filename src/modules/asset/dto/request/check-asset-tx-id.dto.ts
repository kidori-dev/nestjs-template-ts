import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckAssetTxIdDto {
  @ApiProperty({
    example: '1',
    description: '아이디',
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}
