import { Request as ExpressRequest } from 'express';
import session from 'express-session';
import { UserEntity } from '../../modules/user/entities/user.entity';
import { AdminEntity } from '../../modules/admin/entities/admin.entity';

export interface ICustomRequest extends ExpressRequest {
  user: UserEntity | AdminEntity;
  session: session.Session & { expires?: Date };
}
