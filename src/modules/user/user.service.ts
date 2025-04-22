import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { DataNotFoundException } from '../../exceptions/exception-422';
import { PostUserUserDto } from './dto/request/post-user.user-dto';
import { randomStr } from '../../utils/helper';
import { PostUserAdminDto } from './dto/request/post-user.admin-dto';
import { GetUserDetailDto } from './dto/request/get-user-detail.dto';
import { Transactional } from 'typeorm-transactional';
import { PatchUserUserDto } from './dto/request/patch-user.user-dto';
import { UserRoleEnum } from '../../constants/enums';
import { AssetService } from '../asset/asset.service';
import { GetUserListUserDto } from './dto/request/get-user-list.user-dto';
import { GetUserListAdminDto } from './dto/request/get-user-list.admin-dto';
import { PatchUserAdminDto } from './dto/request/patch-user.admin-dto';
import { PointService } from '../point/point.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly assetService: AssetService,
    private readonly pointService: PointService,
  ) {}

  async getDetail(dto: GetUserDetailDto): Promise<UserEntity> {
    const condition: FindOptionsWhere<UserEntity> = {
      id: dto.id,
    };
    if (dto.referrerUserId) {
      condition.referrerUserId = dto.referrerUserId;
    }

    const user = await this.userRepository.findOne({
      where: condition,
      relations: {
        photo: true,
        asset: true,
        point: true,
      },
    });
    if (!user) throw new DataNotFoundException();
    return user;
  }

  async getUser(condition: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: condition,
      relations: {
        photo: true,
        asset: true,
        point: true,
      },
    });
    if (!user) throw new DataNotFoundException();
    return user;
  }

  async getListByUser(dto: GetUserListUserDto, userId: string): Promise<[UserEntity[], number]> {
    const condition: FindOptionsWhere<UserEntity> = {
      id: userId,
    };
    return await this.userRepository.findAndCount({
      where: condition,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      order: {
        id: 'desc',
      },
      relations: {
        photo: true,
      },
    });
  }

  async getListByAdmin(dto: GetUserListAdminDto): Promise<[UserEntity[], number]> {
    const condition: FindOptionsWhere<UserEntity> = {};
    return await this.userRepository.findAndCount({
      where: condition,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      order: {
        id: 'desc',
      },
      relations: {
        photo: true,
      },
    });
  }

  @Transactional()
  async createByAdmin(dto: PostUserAdminDto): Promise<boolean> {
    const createData: UserEntity = this.userRepository.create({
      ...dto,
      role: UserRoleEnum.MANAGER,
      inviteCode: await this.getInviteCode(),
    });
    const item: UserEntity = await this.userRepository.save(createData);
    await this.assetService.createAsset(item.id);
    await this.pointService.createPoint(item.id);
    return true;
  }

  @Transactional()
  async create(dto: PostUserUserDto): Promise<boolean> {
    let referrerUserId: string | null = null;
    if (dto.referrerCode) {
      const referrerUser = await this.getUser({ inviteCode: dto.referrerCode });
      referrerUserId = referrerUser.id;
    }
    const createData: UserEntity = this.userRepository.create({
      ...dto,
      role: UserRoleEnum.CUSTOMER,
      referrerUserId: referrerUserId,
      inviteCode: await this.getInviteCode(),
    });
    const item: UserEntity = await this.userRepository.save(createData);
    await this.assetService.createAsset(item.id);
    await this.pointService.createPoint(item.id);
    return true;
  }

  /** 초대 코드 확인 */
  async checkInviteCode(inviteCode: string): Promise<boolean> {
    return await this.userRepository.exist({ where: { inviteCode: inviteCode } });
  }

  async updateByAdmin(dto: PatchUserAdminDto): Promise<boolean> {
    const item = await this.userRepository.findOne({ where: { id: dto.id } });
    if (!item) throw new DataNotFoundException();
    await this.userRepository.update(dto.id, { ...dto });
    return true;
  }

  async updateByUser(dto: PatchUserUserDto, userId: string): Promise<boolean> {
    const item = await this.userRepository.findOne({ where: { id: userId } });
    if (!item) throw new DataNotFoundException();
    await this.userRepository.update(userId, { ...dto });
    return true;
  }

  async delete(id: string) {
    const item = await this.userRepository.findOne({ where: { id: id } });
    if (!item) throw new DataNotFoundException();
    await this.userRepository.softDelete(id);
    return true;
  }

  async getInviteCode(): Promise<string> {
    const size: number = 3; //5문자
    let item: string = randomStr(size).toUpperCase();
    while (1) {
      const exist = await this.userRepository.exist({ where: { inviteCode: item } });
      if (!exist) break;
      item = randomStr(size).toUpperCase();
    }
    return item;
  }
}
