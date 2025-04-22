import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';

export class PostAssetWithdrawUserDto {
  @ApiProperty({
    example: 100,
    description: '출금액',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10000000000)
  amount: number;

  @ApiProperty({
    example: '일본은행',
    description: '은행명',
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  bankName: string;

  @ApiProperty({
    example: '계좌주명',
    description: '계좌주명',
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  accountHolderName: string;

  @ApiProperty({
    example: '계좌번호',
    description: '계좌번호',
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  accountNumber: string;
}
