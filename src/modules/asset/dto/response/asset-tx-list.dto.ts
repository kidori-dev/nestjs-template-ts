import { Transform } from 'class-transformer';
import { numberCommaFormatTransformer } from '../../../../utils/transformers/number-format.transformer';
import { ResponseDtoHelper } from '../../../../utils/response-dto-helper';

export class AssetTxListDto extends ResponseDtoHelper {
  @Transform(numberCommaFormatTransformer, { toClassOnly: true })
  amount: string;
}
