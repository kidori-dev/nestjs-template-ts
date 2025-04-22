import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { UserAuthGuard } from '../auth/session/user-auth.guard';
import { User } from '../../utils/decorators/user.decorator';
import { IUserSession } from '../../utils/types/auth-user.interface';
import { PaginationResultType } from '../../utils/types/pagination-result.type';
import { GetInquiryListDto } from './dto/request/get-inquiry-list..dto';
import { InquiryListDto } from './dto/response/inquiry-list.dto';
import { CheckInquiryIdDto } from './dto/request/check-inquiry-id.dto';
import { InquiryDto } from './dto/response/inquiry.dto';
import { PostInquiryDto } from './dto/request/post-inquiry.dto';
import { PatchInquiryDto } from './dto/request/patch-inquiry.dto';
import { infinityPagination } from '../../utils/infinity-pagination';
import { plainToInstance } from 'class-transformer';

@ApiTags('고객센터 (유저)')
@Controller({
  path: 'user/support',
  version: '1',
})
@UseGuards(UserAuthGuard)
export class SupportUserController {
  constructor(private readonly supportService: SupportService) {}

  @Get('inquiry/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '1:1 문의 리스트',
    description: `1:1 문의 리스트`,
  })
  async inquiryListGet(
    @User() user: IUserSession,
    @Query() dto: GetInquiryListDto,
  ): Promise<PaginationResultType<InquiryListDto>> {
    const [list, totalCount] = await this.supportService.getInquiryList({ ...dto, userId: user.id });
    return infinityPagination({
      instance: InquiryListDto,
      list: list,
      totalCount: totalCount,
      page: dto.page,
      limit: dto.limit,
    });
  }

  @Get('inquiry/detail')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '1:1 문의 상세내역',
    description: `1:1 문의 상세내역`,
  })
  async inquiryDetailGet(@User() user: IUserSession, @Query() dto: CheckInquiryIdDto): Promise<InquiryDto> {
    const result = await this.supportService.getInquiryDetail(dto.id, user.id);
    return plainToInstance(InquiryDto, result);
  }

  @Post('inquiry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '1:1 문의 등록',
    description: `1:1 문의 등록`,
  })
  async inquiryPost(@User() user: IUserSession, @Body() dto: PostInquiryDto): Promise<boolean> {
    return await this.supportService.createInquiry(dto, user.id);
  }

  @Patch('inquiry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '1:1 문의 수정',
    description: `1:1 문의 수정`,
  })
  async inquiryPatch(@User() user: IUserSession, @Body() dto: PatchInquiryDto): Promise<boolean> {
    return await this.supportService.updateInquiry(dto, user.id);
  }

  @Delete('inquiry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '1:1 문의 삭제',
    description: `1:1 문의 삭제`,
  })
  async inquiryDelete(@User() user: IUserSession, @Query() dto: CheckInquiryIdDto): Promise<boolean> {
    return await this.supportService.deleteInquiry(dto.id, user.id);
  }
}
