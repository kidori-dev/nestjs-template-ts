import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PointService } from './point.service';
import { AdminAuthGuard } from '../auth/session/admin-auth.guard';
import { PaginationResultType } from '../../utils/types/pagination-result.type';
import { GetPointLogListDto } from './dto/request/get-point-log-list..dto';
import { PointLogListDto } from './dto/response/point-log-list.dto';
import { infinityPagination } from '../../utils/infinity-pagination';

@ApiTags('포인트 (어드민)')
@Controller({
  path: 'admin/point',
  version: '1',
})
@UseGuards(AdminAuthGuard)
export class PointAdminController {
  constructor(private readonly pointService: PointService) {}

  @Get('log/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '포인트 로그 리스트',
    description: `포인트 로그 리스트`,
  })
  async logListGet(@Query() dto: GetPointLogListDto): Promise<PaginationResultType<PointLogListDto>> {
    const [list, totalCount] = await this.pointService.getLogList(dto);
    return infinityPagination({
      instance: PointLogListDto,
      list: list,
      totalCount: totalCount,
      page: dto.page,
      limit: dto.limit,
    });
  }
}
