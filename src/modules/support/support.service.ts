import { Injectable } from '@nestjs/common';
import { GetInquiryListDto } from './dto/request/get-inquiry-list..dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { InquiryEntity } from './entities/inquiry.entity';
import { PostInquiryDto } from './dto/request/post-inquiry.dto';
import { PatchInquiryDto } from './dto/request/patch-inquiry.dto';
import { DataNotFoundException } from '../../exceptions/exception-422';
import { AccessDeniedException } from '../../exceptions/exception-403';
import { PatchInquiryReplyDto } from './dto/request/patch-inquiry-reply.dto';
import { InquiryStatusEnum, OrderDirection } from '../../constants/enums';
import { NoticeEntity } from './entities/notice.entity';
import { GetNoticeListDto } from './dto/request/get-notice-list..dto';
import { PostNoticeDto } from './dto/request/post-notice.dto';
import BigNumber from 'bignumber.js';
import { PatchNoticeDto } from './dto/request/patch-notice.dto';
import { PatchNoticeOrderDto } from './dto/request/patch-notice-order.dto';
import { PostPopupDto } from './dto/request/post-popup.dto';
import { PopupEntity } from './entities/popup.entity';
import { PatchPopupDto } from './dto/request/patch-popup.dto';
import { PatchPopupOrderDto } from './dto/request/patch-popup-order.dto';
import { GetPopupListDto } from './dto/request/get-popup-list..dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(InquiryEntity)
    private readonly inquiryRepository: Repository<InquiryEntity>,
    @InjectRepository(NoticeEntity)
    private readonly noticeRepository: Repository<NoticeEntity>,
    @InjectRepository(PopupEntity)
    private readonly popupRepository: Repository<PopupEntity>,
  ) {}

  async getInquiryList(dto: GetInquiryListDto): Promise<[InquiryEntity[], number]> {
    const condition: FindOptionsWhere<InquiryEntity> = {};
    if (dto.userId) condition.userId = dto.userId;
    return await this.inquiryRepository.findAndCount({
      select: ['id', 'status', 'title', 'content', 'createdAt', 'updatedAt'],
      where: condition,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      order: {
        id: 'desc',
      },
    });
  }

  /** 공용*/
  async getInquiryDetail(id: string, loginUserId?: string): Promise<InquiryEntity> {
    const item = await this.getInquiry(id);
    if (loginUserId && item.userId !== loginUserId) throw new AccessDeniedException();
    return item;
  }

  async createInquiry(dto: PostInquiryDto, loginUserId: string): Promise<boolean> {
    const createData: InquiryEntity = this.inquiryRepository.create({ ...dto, userId: loginUserId });
    await this.inquiryRepository.save(createData);
    return true;
  }

  async getInquiry(id: string): Promise<InquiryEntity> {
    const item = await this.inquiryRepository.findOne({ where: { id: id } });
    if (!item) throw new DataNotFoundException();
    return item;
  }

  async getNotice(id: string): Promise<NoticeEntity> {
    const item = await this.noticeRepository.findOne({ where: { id: id } });
    if (!item) throw new DataNotFoundException();
    return item;
  }

  async getPopup(id: string): Promise<PopupEntity> {
    const item = await this.popupRepository.findOne({
      where: { id: id },
      relations: { file: true },
    });
    if (!item) throw new DataNotFoundException();
    return item;
  }

  async updateInquiry(dto: PatchInquiryDto, loginUserId: string): Promise<boolean> {
    const item = await this.getInquiry(dto.id);
    if (item.userId !== loginUserId) throw new AccessDeniedException();
    if (dto.title) item.title = dto.title;
    if (dto.content) item.content = dto.content;
    await item.save();
    return true;
  }

  async replyInquiry(dto: PatchInquiryReplyDto, loginAdminId: string): Promise<boolean> {
    const item = await this.getInquiry(dto.id);
    item.reply = dto.reply;
    item.adminId = loginAdminId;
    item.status = InquiryStatusEnum.COMPLETED;
    await item.save();
    return true;
  }

  async rejectInquiry(id: string, loginAdminId: string): Promise<boolean> {
    const item = await this.getInquiry(id);
    item.adminId = loginAdminId;
    item.status = InquiryStatusEnum.REJECTED;
    await item.save();
    return true;
  }

  async deleteInquiry(id: string, loginUserId?: string): Promise<boolean> {
    const item = await this.getInquiry(id);
    if (loginUserId && item.userId !== loginUserId) throw new AccessDeniedException();
    await item.softRemove();
    return true;
  }

  async getNoticeList(dto: GetNoticeListDto): Promise<[NoticeEntity[], number]> {
    const condition: FindOptionsWhere<NoticeEntity> = {};
    return await this.noticeRepository.findAndCount({
      select: ['id', 'title', 'content', 'displayOrder', 'adminId', 'createdAt', 'updatedAt'],
      where: condition,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      order: { displayOrder: 'asc' },
    });
  }

  async createNotice(dto: PostNoticeDto, loginAdminId: string): Promise<boolean> {
    let displayOrderNum = new BigNumber(1);
    const item = await this.noticeRepository.findOne({
      where: {},
      order: { displayOrder: 'desc' },
    });
    if (item) {
      displayOrderNum = displayOrderNum.plus(item.displayOrder);
    }
    const createData = this.noticeRepository.create({
      ...dto,
      adminId: loginAdminId,
      displayOrder: displayOrderNum.toFixed(),
    });
    await this.noticeRepository.save(createData);
    return true;
  }

  async updateNotice(dto: PatchNoticeDto, loginAdminId: string): Promise<boolean> {
    const item = await this.getNotice(dto.id);
    if (dto.content) item.content = dto.content;
    if (dto.title) item.title = dto.title;
    item.adminId = loginAdminId;
    await item.save();
    return true;
  }

  async changeOrderNotice(dto: PatchNoticeOrderDto, loginAdminId: string): Promise<boolean> {
    const notice = await this.getNotice(dto.id);

    const targetNotice = await this.noticeRepository.findOne({
      where: {
        displayOrder:
          dto.direction === OrderDirection.UP ? LessThan(notice.displayOrder) : MoreThan(notice.displayOrder),
      },
      order: {
        displayOrder: dto.direction === OrderDirection.UP ? 'desc' : 'asc',
      },
    });
    if (!targetNotice) throw new DataNotFoundException();

    const temp = notice.displayOrder;
    notice.displayOrder = targetNotice.displayOrder;
    targetNotice.displayOrder = temp;

    notice.adminId = loginAdminId;
    targetNotice.adminId = loginAdminId;

    await notice.save();
    await targetNotice.save();

    return true;
  }

  async createPopup(dto: PostPopupDto, loginAdminId: string) {
    let displayOrderNum = new BigNumber(1);
    const item = await this.popupRepository.findOne({
      where: {},
      order: { displayOrder: 'desc' },
    });
    if (item) {
      displayOrderNum = displayOrderNum.plus(item.displayOrder);
    }
    const createData = this.popupRepository.create({
      ...dto,
      adminId: loginAdminId,
      displayOrder: displayOrderNum.toFixed(),
    });
    await this.popupRepository.save(createData);
    return true;
  }

  async updatePopup(dto: PatchPopupDto, loginAdminId: string): Promise<boolean> {
    const item = await this.getPopup(dto.id);
    if (dto.content) item.content = dto.content;
    if (dto.fileId) item.fileId = dto.fileId;
    item.adminId = loginAdminId;
    await item.save();
    return true;
  }

  async changeOrderPopup(dto: PatchPopupOrderDto, loginAdminId: string): Promise<boolean> {
    const popup = await this.getPopup(dto.id);

    const targetPopup = await this.popupRepository.findOne({
      where: {
        displayOrder: dto.direction === OrderDirection.UP ? LessThan(popup.displayOrder) : MoreThan(popup.displayOrder),
      },
      order: {
        displayOrder: dto.direction === OrderDirection.UP ? 'desc' : 'asc',
      },
    });
    if (!targetPopup) throw new DataNotFoundException();

    const temp = popup.displayOrder;
    popup.displayOrder = targetPopup.displayOrder;
    targetPopup.displayOrder = temp;

    popup.adminId = loginAdminId;
    targetPopup.adminId = loginAdminId;

    await popup.save();
    await targetPopup.save();

    return true;
  }

  async getPopupList(dto: GetPopupListDto): Promise<[PopupEntity[], number]> {
    const condition: FindOptionsWhere<PopupEntity> = {};
    return await this.popupRepository.findAndCount({
      where: condition,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      order: { displayOrder: 'asc' },
      relations: { file: true },
    });
  }
}
