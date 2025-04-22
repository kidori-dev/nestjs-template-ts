import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssetService } from './asset.service';
import { AdminAuthGuard } from '../auth/session/admin-auth.guard';
import { GetAssetTxListDto } from './dto/request/get-asset-tx-list..dto';
import { PaginationResultType } from '../../utils/types/pagination-result.type';
import { AssetTxListDto } from './dto/response/asset-tx-list.dto';
import { CheckAssetTxIdDto } from './dto/request/check-asset-tx-id.dto';
import { infinityPagination } from '../../utils/infinity-pagination';

@ApiTags('자산 (어드민)')
@Controller({
  path: 'admin/asset',
  version: '1',
})
@UseGuards(AdminAuthGuard)
export class AssetAdminController {
  constructor(private readonly assetService: AssetService) {}

  @Get('transaction/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '입출금 내역 조회',
    description: `입출금 내역 조회`,
  })
  async listGet(@Query() dto: GetAssetTxListDto): Promise<PaginationResultType<AssetTxListDto>> {
    const [list, totalCount] = await this.assetService.getTxList(dto);
    return infinityPagination({
      instance: AssetTxListDto,
      list: list,
      totalCount: totalCount,
      page: dto.page,
      limit: dto.limit,
    });
  }

  @Post('deposit/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '입금 승인',
    description: `입금 승인`,
  })
  async depositApprovePost(@Body() dto: CheckAssetTxIdDto): Promise<boolean> {
    return await this.assetService.approveDeposit(dto.id);
  }

  @Post('deposit/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '입금 거절',
    description: `입금 거절`,
  })
  async depositRejectPost(@Body() dto: CheckAssetTxIdDto): Promise<boolean> {
    return await this.assetService.rejectDeposit(dto.id);
  }

  @Post('withdraw/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '출금 거절',
    description: `출금 거절`,
  })
  async withdrawRejectPost(@Body() dto: CheckAssetTxIdDto): Promise<boolean> {
    return await this.assetService.rejectWithdraw(dto.id);
  }
}
