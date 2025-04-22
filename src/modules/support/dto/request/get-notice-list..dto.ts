import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class GetNoticeListDto {
  @ApiProperty({
    example: 1,
    description: '리스트 페이지 //숫자, 최소 1',
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    example: 10,
    description: '리스트 수 // 숫자, 최소 1 최대 50',
    minimum: 1,
    default: 10,
    maximum: 50,
    required: false,
  })
  @Min(1)
  @Max(50)
  @IsOptional()
  @IsNumber()
  limit: number = 10;
}
