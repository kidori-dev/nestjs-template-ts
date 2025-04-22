import { Exclude, Expose, Type } from 'class-transformer';
import { FileDto } from '../../../files/dto/response/file.dto';
import { ResponseDtoHelper } from '../../../../utils/response-dto-helper';
import { AssetDto } from '../../../asset/dto/response/asset.dto';
import { PointDto } from '../../../point/dto/response/point.dto';

export class UserSessionDto extends ResponseDtoHelper {
  @Expose()
  @Type(() => FileDto)
  photo: FileDto;

  @Expose()
  @Type(() => AssetDto)
  asset: AssetDto;

  @Expose()
  @Type(() => PointDto)
  point: PointDto;

  @Exclude()
  password: string;
}
