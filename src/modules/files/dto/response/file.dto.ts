import { Exclude } from 'class-transformer';
import { ResponseDtoHelper } from '../../../../utils/response-dto-helper';

export class FileDto extends ResponseDtoHelper {
  // @Expose({ name: 'createdAt' })
  // @Transform(
  //   ({ obj }) => {
  //     if (!obj.hasOwnProperty('createdAt')) {
  //       return null;
  //     }
  //     return dateFullFormat(obj.createdAt);
  //   },
  //   { toClassOnly: true },
  // )
  // createdAt: string;

  @Exclude()
  id: string;

  @Exclude()
  size: string;
}
