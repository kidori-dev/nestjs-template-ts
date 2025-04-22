import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PointService } from './point.service';
import { UserAuthGuard } from '../auth/session/user-auth.guard';
import { User } from '../../utils/decorators/user.decorator';
import { IUserSession } from '../../utils/types/auth-user.interface';
import { PostPointSwapUserDto } from './dto/request/post-point-swap.user-dto';
import { GetPointLogListDto } from './dto/request/get-point-log-list..dto';
import { PaginationResultType } from '../../utils/types/pagination-result.type';
import { PointLogListDto } from './dto/response/point-log-list.dto';
import { infinityPagination } from '../../utils/infinity-pagination';

@ApiTags('포인트 (유저)')
@Controller({
  path: 'user/point',
  version: '1',
})
@UseGuards(UserAuthGuard)
export class PointUserController {
  constructor(private readonly pointService: PointService) {}

  @Get('log/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '포인트 로그 리스트',
    description: `포인트 로그 리스트`,
  })
  async logListGet(
    @User() user: IUserSession,
    @Query() dto: GetPointLogListDto,
  ): Promise<PaginationResultType<PointLogListDto>> {
    const [list, totalCount] = await this.pointService.getLogList({ ...dto, userId: user.id });
    return infinityPagination({
      instance: PointLogListDto,
      list: list,
      totalCount: totalCount,
      page: dto.page,
      limit: dto.limit,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '마이 포인트',
    description: `마이 포인트`,
  })
  async pointGet(@User() user: IUserSession): Promise<string> {
    const result = await this.pointService.getPointByUserId(user.id);
    return result.amount;
  }

  @Post('swap')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '포인트 스왑',
    description: `포인트 스왑`,
  })
  async depositPost(@User() user: IUserSession, @Body() dto: PostPointSwapUserDto): Promise<boolean> {
    return await this.pointService.swap(dto.amount, user.id);
  }
}
