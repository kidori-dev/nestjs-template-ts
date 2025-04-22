import { Exclude } from 'class-transformer';
import { ResponseDtoHelper } from '../../../../utils/response-dto-helper';

export class PointDto extends ResponseDtoHelper {
  @Exclude()
  id: string;
}
