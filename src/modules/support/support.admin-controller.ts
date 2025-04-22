import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { AdminAuthGuard } from '../auth/session/admin-auth.guard';
import { GetInquiryListDto } from './dto/request/get-inquiry-list..dto';
import { PaginationResultType } from '../../utils/types/pagination-result.type';
import { InquiryListDto } from './dto/response/inquiry-list.dto';
import { CheckInquiryIdDto } from './dto/request/check-inquiry-id.dto';
import { InquiryDto } from './dto/response/inquiry.dto';
import { PatchInquiryReplyDto } from './dto/request/patch-inquiry-reply.dto';
import { IAdminSession } from '../../utils/types/auth-admin.interface';
import { Admin } from '../../utils/decorators/admin.decorator';
import { infinityPagination } from '../../utils/infinity-pagination';
import { plainToInstance } from 'class-transformer';
import { GetNoticeListDto } from './dto/request/get-notice-list..dto';
import { NoticeListDto } from './dto/response/notice-list.dto';
import { CheckNoticeIdDto } from './dto/request/check-notice-id.dto';
import { NoticeDto } from './dto/response/notice.dto';
import { PostNoticeDto } from './dto/request/post-notice.dto';
import { PatchNoticeDto } from './dto/request/patch-notice.dto';
import { PatchNoticeOrderDto } from './dto/request/patch-notice-order.dto';
import { PostPopupDto } from './dto/request/post-popup.dto';
import { PatchPopupDto } from './dto/request/patch-popup.dto';
import { PatchPopupOrderDto } from './dto/request/patch-popup-order.dto';
import { CheckPopupIdDto } from './dto/request/check-popup-id.dto';
import { PopupListDto } from './dto/response/popup-list.dto';
import { GetPopupListDto } from './dto/request/get-popup-list..dto';
import { PopupDto } from './dto/response/popup.dto';

@ApiTags('고객센터 (어드민)')
@Controller({
  path: 'admin/support',
  version: '1',
})
@UseGuards(AdminAuthGuard)
export class SupportAdminController {
  constructor(private readonly supportService: SupportService) {}

  @Get('inquiry/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '1:1 문의 리스트',
    description: `1:1 문의 리스트`,
  })
  async inquiryListGet(@Query() dto: GetInquiryListDto): Promise<PaginationResultType<InquiryListDto>> {
    const [list, totalCount] = await this.supportService.getInquiryList(dto);
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
  async inquiryDetailGet(@Query() dto: CheckInquiryIdDto): Promise<InquiryDto> {
    const result = await this.supportService.getInquiryDetail(dto.id);
    return plainToInstance(InquiryDto, result);
  }

  @Patch('inquiry/reply')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '1:1 문의 답변',
    description: `1:1 문의 답변`,
  })
  async inquiryReplyPatch(@Admin() admin: IAdminSession, @Body() dto: PatchInquiryReplyDto): Promise<boolean> {
    return await this.supportService.replyInquiry(dto, admin.id);
  }

  @Patch('inquiry/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '1:1 문의 답변 거절',
    description: `1:1 문의 답변 거절`,
  })
  async inquiryRejectPatch(@Admin() admin: IAdminSession, @Body() dto: CheckInquiryIdDto): Promise<boolean> {
    return await this.supportService.rejectInquiry(dto.id, admin.id);
  }

  @Delete('inquiry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '1:1 문의 삭제',
    description: `1:1 문의 삭제`,
  })
  async inquiryDelete(@Query() dto: CheckInquiryIdDto): Promise<boolean> {
    return await this.supportService.deleteInquiry(dto.id);
  }

  @Get('notice/list')
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '공지사항 상세내역',
    description: `공지사항 상세내역`,
  })
  async noticeDetailGet(@Query() dto: CheckNoticeIdDto): Promise<NoticeDto> {
    const result = await this.supportService.getNotice(dto.id);
    return plainToInstance(NoticeDto, result);
  }

  @Post('notice')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '공지사항 등록',
    description: `공지사항 등록`,
  })
  async noticePost(@Admin() admin: IAdminSession, @Body() dto: PostNoticeDto): Promise<boolean> {
    return await this.supportService.createNotice(dto, admin.id);
  }

  @Patch('notice')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '공지사항 수정',
    description: `공지사항 수정`,
  })
  async noticePatch(@Admin() admin: IAdminSession, @Body() dto: PatchNoticeDto): Promise<boolean> {
    return await this.supportService.updateNotice(dto, admin.id);
  }

  @Patch('notice/change-order')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '공지사항 순서 변경',
    description: `공지사항 순서 변경`,
  })
  async noticeOrderPatch(@Admin() admin: IAdminSession, @Body() dto: PatchNoticeOrderDto): Promise<boolean> {
    return await this.supportService.changeOrderNotice(dto, admin.id);
  }

  @Get('popup/list')
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '팝업 상세내역',
    description: `팝업 상세내역`,
  })
  async popupDetailGet(@Query() dto: CheckPopupIdDto): Promise<PopupDto> {
    const result = await this.supportService.getPopup(dto.id);
    return plainToInstance(PopupDto, result);
  }

  @Post('popup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '팝업 등록',
    description: `팝업 등록`,
  })
  async popupPost(@Admin() admin: IAdminSession, @Body() dto: PostPopupDto): Promise<boolean> {
    return await this.supportService.createPopup(dto, admin.id);
  }

  @Patch('popup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '팝업 수정',
    description: `팝업 수정`,
  })
  async popupPatch(@Admin() admin: IAdminSession, @Body() dto: PatchPopupDto): Promise<boolean> {
    return await this.supportService.updatePopup(dto, admin.id);
  }

  @Patch('popup/change-order')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '팝업 순서 변경',
    description: `팝업 순서 변경`,
  })
  async popupOrderPatch(@Admin() admin: IAdminSession, @Body() dto: PatchPopupOrderDto): Promise<boolean> {
    return await this.supportService.changeOrderPopup(dto, admin.id);
  }
}
