import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { PaginationResultType } from '../../utils/types/pagination-result.type';
import { UseCache } from '../../utils/decorators/use-cache.decorator';
import { NoticeListDto } from './dto/response/notice-list.dto';
import { GetNoticeListDto } from './dto/request/get-notice-list..dto';
import { CheckNoticeIdDto } from './dto/request/check-notice-id.dto';
import { NoticeDto } from './dto/response/notice.dto';
import { plainToInstance } from 'class-transformer';
import { infinityPagination } from '../../utils/infinity-pagination';
import { GetPopupListDto } from './dto/request/get-popup-list..dto';
import { PopupListDto } from './dto/response/popup-list.dto';
import { CheckPopupIdDto } from './dto/request/check-popup-id.dto';
import { PopupDto } from './dto/response/popup.dto';

@ApiTags('고객센터 (게스트)')
@Controller({
  path: 'guest/support',
  version: '1',
})
export class SupportGuestController {
  constructor(private readonly supportService: SupportService) {}

  @Get('notice/list')
  @UseCache()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '공지사항 리스트',
    description: `공지사항 리스트`,
  })
  async noticeListGet(@Query() dto: GetNoticeListDto): Promise<PaginationResultType<NoticeListDto>> {
    const [list, totalCount] = await this.supportService.getNoticeList(dto);
    return infinityPagination({
      instance: NoticeListDto,
      list: list,
      totalCount: totalCount,
      page: dto.page,
      limit: dto.limit,
    });
  }

  @Get('notice/detail')
  @UseCache()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '공지사항 상세내역',
    description: `공지사항 상세내역`,
  })
  async noticeDetailGet(@Query() dto: CheckNoticeIdDto): Promise<NoticeDto> {
    const result = await this.supportService.getNotice(dto.id);
    return plainToInstance(NoticeDto, result);
  }

  @Get('popup/list')
  @UseCache()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '팝업 리스트',
    description: `팝업 리스트`,
  })
  async popupGet(@Query() dto: GetPopupListDto): Promise<PaginationResultType<PopupListDto>> {
    const [list, totalCount] = await this.supportService.getPopupList(dto);
    return infinityPagination({
      instance: PopupListDto,
      list: list,
      totalCount: totalCount,
      page: dto.page,
      limit: dto.limit,
    });
  }

  @Get('popup/detail')
  @UseCache()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '팝업 상세내역',
    description: `팝업 상세내역`,
  })
  async popupDetailGet(@Query() dto: CheckPopupIdDto): Promise<PopupDto> {
    const result = await this.supportService.getPopup(dto.id);
    return plainToInstance(PopupDto, result);
  }
}
