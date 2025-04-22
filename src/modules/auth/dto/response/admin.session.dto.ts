import { Exclude } from 'class-transformer';
import { ResponseDtoHelper } from '../../../../utils/response-dto-helper';

export class AdminSessionDto extends ResponseDtoHelper {
  @Exclude()
  password: string;
}
