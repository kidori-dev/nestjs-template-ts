import { Exclude } from 'class-transformer';
import { ResponseDtoHelper } from '../../../../utils/response-dto-helper';

export class AssetDto extends ResponseDtoHelper {
  @Exclude()
  id: string;
}
