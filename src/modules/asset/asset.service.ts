import { Injectable } from '@nestjs/common';
import { sleep } from 'src/utils/helper';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AssetEntity } from './entities/asset.entity';
import { AssetLogEntity } from './entities/asset-log.entity';
import { AssetTxEntity } from './entities/asset-tx.entity';
import { PostAssetDepositUserDto } from './dto/request/post-asset-deposit.user-dto';
import { Transactional } from 'typeorm-transactional';
import { AssetLogTypeEnum, TransactionStatusEnum, TransactionTypeEnum } from '../../constants/enums';
import { PostAssetWithdrawUserDto } from './dto/request/post-asset-withdraw.user-dto';
import { DataNotFoundException } from '../../exceptions/exception-422';
import BigNumber from 'bignumber.js';
import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import { plainToInstance } from 'class-transformer';
import { GetAssetTxListDto } from './dto/request/get-asset-tx-list..dto';
import { CreateAssetLogDto } from './dto/request/create-asset-log-dto';
import { validate } from 'class-validator';
import { AccessDeniedException } from '../../exceptions/exception-403';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(AssetEntity)
    private readonly assetRepository: Repository<AssetEntity>,
    @InjectRepository(AssetLogEntity)
    private readonly assetLogRepository: Repository<AssetLogEntity>,
    @InjectRepository(AssetTxEntity)
    private readonly assetTxRepository: Repository<AssetTxEntity>,
  ) {}

  async getAssetByUserId(userId: string): Promise<AssetEntity> {
    const item = await this.assetRepository.findOne({
      where: {
        userId: userId,
      },
    });
    if (!item) throw new DataNotFoundException();
    return item;
  }

  async getAssetTransaction(id: string): Promise<AssetTxEntity> {
    const item = await this.assetTxRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!item) throw new DataNotFoundException();
    return item;
  }

  /** 공용 기능 */
  async getTxList(dto: GetAssetTxListDto): Promise<[AssetTxEntity[], number]> {
    const condition: FindOptionsWhere<AssetTxEntity> = {};
    if (dto.userId) condition.userId = dto.userId;
    return await this.assetTxRepository.findAndCount({
      where: condition,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      order: {
        id: 'desc',
      },
    });
  }

  /** 유저 기능 */
  @Transactional()
  async deposit(dto: PostAssetDepositUserDto, userId: string): Promise<boolean> {
    const amount = new BigNumber(dto.amount).toFixed();
    const createData: AssetTxEntity = this.assetTxRepository.create({
      ...dto,
      amount,
      userId: userId,
      type: TransactionTypeEnum.DEPOSIT,
      status: TransactionStatusEnum.PENDING,
    });
    await this.assetTxRepository.save(createData);
    return true;
  }

  async createAssetLog(dto: CreateAssetLogDto): Promise<AssetLogEntity> {
    const errors = await validate(plainToInstance(CreateAssetLogDto, dto));
    if (errors.length > 0) throw new UnprocessableEntityException(errors[0].constraints);
    const createData = this.assetLogRepository.create(dto);
    return await this.assetLogRepository.save(createData);
  }

  /** 어드민 기능 */
  @Transactional()
  async approveDeposit(id: string): Promise<boolean> {
    const transaction = await this.getAssetTransaction(id);
    const asset = await this.getAssetByUserId(transaction.userId);

    const transactionAmount = new BigNumber(transaction.amount);
    const assetAmount = new BigNumber(asset.amount);
    const resultAmount = transactionAmount.plus(assetAmount);

    await this.createAssetLog({
      type: AssetLogTypeEnum.DEPOSIT,
      assetId: asset.id,
      previousAmount: asset.amount,
      amount: transaction.amount,
      currentAmount: resultAmount.toFixed(),
      userId: transaction.userId,
      isPositive: true,
      refId: transaction.id,
    });

    asset.amount = resultAmount.toFixed();
    transaction.status = TransactionStatusEnum.COMPLETED;

    await asset.save();
    await transaction.save();

    return true;
  }

  /** 어드민 기능*/
  async rejectDeposit(id: string): Promise<boolean> {
    const transaction = await this.getAssetTransaction(id);
    transaction.status = TransactionStatusEnum.REJECTED;
    await transaction.save();
    return true;
  }

  /** 유저 기능 */
  async cancelDeposit(id: string, userId: string): Promise<boolean> {
    const transaction = await this.getAssetTransaction(id);
    if (transaction.userId !== userId) {
      throw new AccessDeniedException();
    }
    transaction.status = TransactionStatusEnum.CANCELED;
    await transaction.save();

    return true;
  }

  /** 유저 기능 */
  async cancelWithdraw(id: string, userId: string): Promise<boolean> {
    const transaction = await this.getAssetTransaction(id);
    if (transaction.userId !== userId) {
      throw new AccessDeniedException();
    }
    const asset = await this.getAssetByUserId(transaction.userId);
    const assetAmount = new BigNumber(asset.amount);
    const withdrawAmount = new BigNumber(transaction.amount);
    const resultAmount = assetAmount.plus(withdrawAmount);

    await this.createAssetLog({
      type: AssetLogTypeEnum.WITHDRAW_CANCEL,
      assetId: asset.id,
      previousAmount: asset.amount,
      amount: transaction.amount,
      currentAmount: resultAmount.toFixed(),
      userId: transaction.userId,
      isPositive: true,
      refId: transaction.id,
    });

    transaction.status = TransactionStatusEnum.CANCELED;
    await transaction.save();
    return true;
  }

  /** 어드민 기능*/
  async rejectWithdraw(id: string): Promise<boolean> {
    const transaction = await this.getAssetTransaction(id);
    const asset = await this.getAssetByUserId(transaction.userId);
    const assetAmount = new BigNumber(asset.amount);
    const withdrawAmount = new BigNumber(transaction.amount);
    const resultAmount = assetAmount.plus(withdrawAmount);

    await this.createAssetLog({
      type: AssetLogTypeEnum.WITHDRAW_REJECT,
      assetId: asset.id,
      previousAmount: asset.amount,
      amount: transaction.amount,
      currentAmount: resultAmount.toFixed(),
      userId: transaction.userId,
      isPositive: true,
      refId: transaction.id,
    });

    transaction.status = TransactionStatusEnum.REJECTED;
    await transaction.save();
    return true;
  }

  /** 유저 기능 */
  @Transactional()
  async withdraw(dto: PostAssetWithdrawUserDto, userId: string): Promise<boolean> {
    const asset = await this.getAssetByUserId(userId);

    const assetAmount = new BigNumber(asset.amount);
    const withdrawAmount = new BigNumber(dto.amount);
    const resultAmount = assetAmount.minus(withdrawAmount);

    if (assetAmount.isLessThan(withdrawAmount)) {
      throw new UnprocessableEntityException('보유 금액보다 출금 요청이 더 많습니다.');
    }
    const amount = new BigNumber(dto.amount).toFixed();
    const createData: AssetTxEntity = this.assetTxRepository.create({
      ...dto,
      amount,
      type: TransactionTypeEnum.WITHDRAW,
      status: TransactionStatusEnum.PENDING,
    });
    const transaction = await this.assetTxRepository.save(createData);

    await this.createAssetLog({
      type: AssetLogTypeEnum.WITHDRAW,
      assetId: asset.id,
      previousAmount: asset.amount,
      amount: transaction.amount,
      currentAmount: resultAmount.toFixed(),
      userId: transaction.userId,
      isPositive: false,
      refId: transaction.id,
    });

    asset.amount = resultAmount.toFixed();
    await asset.save();
    return true;
  }

  async createAsset(userId: string): Promise<AssetEntity> {
    const createData = this.assetRepository.create({ userId: userId });
    return await this.assetRepository.save(createData);
  }
}
