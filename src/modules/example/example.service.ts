import { Injectable } from '@nestjs/common';
import { sleep } from 'src/utils/helper';

@Injectable()
export class ExampleService {
  constructor() {}

  async exampleGet(): Promise<string> {
    await sleep(300);
    return 'exampleGet';
  }
}

/** 기본 userRepository find 로 안되고 groupBy 를 사용해야할 때
 *
 async getListWithPagination(dto: GetUserListDto): Promise<[UserListDto[], number]> {
 const where: FindOptionsWhere<UserEntity> = {};
 const list = await this.userRepository
 .createQueryBuilder('user')
 .select([
 'user.id AS id',
 'user.createdAt AS createdAt',
 'user.email AS email',
 'user.level AS level',
 'user.name AS name',
 'COALESCE(SUM(asset.count), 0) AS totalAsset',
 'user.referralCount AS referralCount',
 'user.point AS point',
 'user.publicKey AS publicKey',
 'user.country AS country',
 ])
 .leftJoin('user_assets', 'asset', 'asset.publicKey = user.publicKey')
 .where(where)
 .offset((dto.page - 1) * dto.limit)
 .limit(dto.limit)
 .orderBy('user.id', 'DESC')
 .groupBy('user.id') // 그룹화하여 유저별 합산
 .getRawMany();

 const totalCount = await this.userRepository.createQueryBuilder('user').where(where).getCount();

 return [plainToInstance(UserListDto, list, {excludeExtraneousValues: true}), totalCount];
 }
 */
