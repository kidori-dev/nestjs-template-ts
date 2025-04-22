import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OrderDirection } from '../../../../constants/enums';

export class PatchNoticeOrderDto {
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
    example: 'up',
    description: 'up/down',
    required: true,
    enum: OrderDirection,
  })
  @IsNotEmpty()
  @IsEnum(OrderDirection)
  direction: OrderDirection;
}
