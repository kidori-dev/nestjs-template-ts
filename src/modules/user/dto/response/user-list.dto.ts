import { Exclude } from 'class-transformer';
import { ResponseDtoHelper } from '../../../../utils/response-dto-helper';

export class UserListDto extends ResponseDtoHelper {
  @Exclude()
  password: string;
}
