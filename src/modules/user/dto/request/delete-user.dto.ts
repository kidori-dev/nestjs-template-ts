import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    example: '1',
    description: '유저 아이디',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}
