import { IsBoolean, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { PointLogTypeEnum } from '../../../../constants/enums';

export class CreatePointLogDto {
  @IsNotEmpty()
  @IsString()
  pointId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  type: PointLogTypeEnum;

  @IsNotEmpty()
  @IsNumberString()
  previousAmount: string;

  @IsNotEmpty()
  @IsBoolean()
  isPositive: boolean;

  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @IsNotEmpty()
  @IsNumberString()
  currentAmount: string;
}
