import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssetService } from './asset.service';
import { UserAuthGuard } from '../auth/session/user-auth.guard';
import { User } from '../../utils/decorators/user.decorator';
import { PostAssetDepositUserDto } from './dto/request/post-asset-deposit.user-dto';
import { IUserSession } from '../../utils/types/auth-user.interface';
import { PostAssetWithdrawUserDto } from './dto/request/post-asset-withdraw.user-dto';
import { PaginationResultType } from '../../utils/types/pagination-result.type';
import { GetAssetTxListDto } from './dto/request/get-asset-tx-list..dto';
import { AssetTxListDto } from './dto/response/asset-tx-list.dto';
import { CheckAssetTxIdDto } from './dto/request/check-asset-tx-id.dto';
import { infinityPagination } from '../../utils/infinity-pagination';

@ApiTags('자산 (유저)')
@Controller({
  path: 'user/asset',
  version: '1',
})
@UseGuards(UserAuthGuard)
export class AssetUserController {
  constructor(private readonly assetService: AssetService) {}

  @Get('transaction/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '입출금 내역 조회',
    description: `입출금 내역 조회`,
  })
  async listGet(
    @User() user: IUserSession,
    @Query() dto: GetAssetTxListDto,
  ): Promise<PaginationResultType<AssetTxListDto>> {
    const [list, totalCount] = await this.assetService.getTxList({ ...dto, userId: user.id });
    return infinityPagination({
      instance: AssetTxListDto,
      list: list,
      totalCount: totalCount,
      page: dto.page,
      limit: dto.limit,
    });
  }

  @Post('deposit/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '입금 신청',
    description: `입금 신청`,
  })
  async depositPost(@User() user: IUserSession, @Body() dto: PostAssetDepositUserDto): Promise<boolean> {
    return await this.assetService.deposit(dto, user.id);
  }

  @Post('deposit/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '입금 취소',
    description: `입금 취소`,
  })
  async depositCancelPost(@User() user: IUserSession, @Body() dto: CheckAssetTxIdDto): Promise<boolean> {
    return await this.assetService.cancelDeposit(dto.id, user.id);
  }

  @Post('withdraw/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '출금 신청',
    description: `출금 신청`,
  })
  async withdrawPost(@User() user: IUserSession, @Body() dto: PostAssetWithdrawUserDto): Promise<boolean> {
    return await this.assetService.withdraw(dto, user.id);
  }

  @Post('withdraw/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '출금 취소',
    description: `출금 취소`,
  })
  async withdrawCancelPost(@User() user: IUserSession, @Body() dto: CheckAssetTxIdDto): Promise<boolean> {
    return await this.assetService.cancelWithdraw(dto.id, user.id);
  }
}
