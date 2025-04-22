import { ResponseDtoHelper } from '../../../../utils/response-dto-helper';
import { Expose, Type } from 'class-transformer';
import { FileDto } from '../../../files/dto/response/file.dto';

export class PopupListDto extends ResponseDtoHelper {
  @Expose()
  @Type(() => FileDto)
  file: FileDto;
}
