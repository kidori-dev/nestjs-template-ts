import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PointEntity } from './entities/point.entity';
import { PointLogEntity } from './entities/point-log.entity';
import BigNumber from 'bignumber.js';
import { AssetService } from '../asset/asset.service';
import { DataNotFoundException } from '../../exceptions/exception-422';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import { CreatePointLogDto } from './dto/request/create-point-log-dto';
import { Transactional } from 'typeorm-transactional';
import { AssetLogTypeEnum, PointLogTypeEnum } from '../../constants/enums';
import { GetPointLogListDto } from './dto/request/get-point-log-list..dto';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(PointEntity)
    private readonly pointRepository: Repository<PointEntity>,
    @InjectRepository(PointLogEntity)
    private readonly pointLogRepository: Repository<PointLogEntity>,
    private readonly assetService: AssetService,
  ) {}

  async getLogList(dto: GetPointLogListDto): Promise<[PointLogEntity[], number]> {
    const condition: FindOptionsWhere<PointLogEntity> = {};

    if (dto.userId) condition.userId = dto.userId;
    if (dto.pointId) condition.pointId = dto.pointId;

    return await this.pointLogRepository.findAndCount({
      where: condition,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      order: {
        id: 'desc',
      },
    });
  }

  async getPointByUserId(userId: string): Promise<PointEntity> {
    const item = await this.pointRepository.findOne({
      where: {
        userId: userId,
      },
    });
    if (!item) throw new DataNotFoundException();
    return item;
  }

  async createPointLog(dto: CreatePointLogDto): Promise<PointLogEntity> {
    const errors = await validate(plainToInstance(CreatePointLogDto, dto));
    if (errors.length > 0) throw new UnprocessableEntityException(errors[0].constraints);
    const createData = this.pointLogRepository.create(dto);
    return await this.pointLogRepository.save(createData);
  }

  @Transactional()
  async swap(amount: number, userId: string): Promise<boolean> {
    const asset = await this.assetService.getAssetByUserId(userId);
    const point = await this.getPointByUserId(userId);

    const swapAmount = new BigNumber(amount);
    const pointAmount = new BigNumber(point.amount);
    const assetAmount = new BigNumber(asset.amount);
    const resultPointAmount = pointAmount.minus(swapAmount);
    const resultAssetAmount = swapAmount.plus(assetAmount);

    if (pointAmount.isLessThan(swapAmount)) {
      throw new UnprocessableEntityException('보유 포인트 보다 스왑 요청이 더 많습니다.');
    }

    const pointLog = await this.createPointLog({
      pointId: point.id,
      type: PointLogTypeEnum.SWAP,
      isPositive: false,
      userId: userId,
      previousAmount: point.amount,
      amount: swapAmount.toFixed(),
      currentAmount: resultPointAmount.toFixed(),
    });

    await this.assetService.createAssetLog({
      assetId: asset.id,
      type: AssetLogTypeEnum.POINT_SWAP,
      userId: userId,
      refId: pointLog.id,
      isPositive: true,
      previousAmount: asset.amount,
      amount: swapAmount.toFixed(),
      currentAmount: resultAssetAmount.toFixed(),
    });

    point.amount = resultPointAmount.toFixed();
    await point.save();

    asset.amount = resultAssetAmount.toFixed();
    await asset.save();

    return true;
  }

  async createPoint(userId: string): Promise<PointEntity> {
    const createData = this.pointRepository.create({ userId: userId });
    return await this.pointRepository.save(createData);
  }
}
