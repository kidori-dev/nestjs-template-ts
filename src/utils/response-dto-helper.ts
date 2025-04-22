import { Exclude, Transform } from 'class-transformer';
import { dateFullFormatTransformer } from './transformers/date-format.transformer';

export abstract class ResponseDtoHelper {
  @Transform(dateFullFormatTransformer, { toClassOnly: true })
  createdAt: string;

  @Transform(dateFullFormatTransformer, { toClassOnly: true })
  updatedAt: string;

  @Exclude()
  deletedAt: string;

  @Exclude()
  __entity: string;
}
