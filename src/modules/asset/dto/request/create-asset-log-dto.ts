import { IsBoolean, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { AssetLogTypeEnum } from '../../../../constants/enums';

export class CreateAssetLogDto {
  @IsNotEmpty()
  @IsString()
  assetId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  refId: string;

  @IsNotEmpty()
  @IsString()
  type: AssetLogTypeEnum;

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
