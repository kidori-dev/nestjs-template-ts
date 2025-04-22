import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class PostPointSwapUserDto {
  @ApiProperty({
    example: 100,
    description: '스왑할 포인트',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10000000000)
  amount: number;
}
