import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDetailDto } from './dto/response/user-detail.dto';
import { DeleteUserDto } from './dto/request/delete-user.dto';
import { PaginationResultType } from '../../utils/types/pagination-result.type';
import { UserListDto } from './dto/response/user-list.dto';
import { GetUserDetailDto } from './dto/request/get-user-detail.dto';
import { AdminAuthGuard } from '../auth/session/admin-auth.guard';
import { IAdminSession } from '../../utils/types/auth-admin.interface';
import { Admin } from '../../utils/decorators/admin.decorator';
import { PostUserAdminDto } from './dto/request/post-user.admin-dto';
import { PatchUserAdminDto } from './dto/request/patch-user.admin-dto';
import { GetUserListAdminDto } from './dto/request/get-user-list.admin-dto';
import { plainToInstance } from 'class-transformer';
import { infinityPagination } from '../../utils/infinity-pagination';

@ApiTags('회원관리 (어드민)')
@Controller({
  path: 'admin/member',
  version: '1',
})
@UseGuards(AdminAuthGuard)
export class UserAdminController {
  constructor(private readonly usersService: UserService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '회원 리스트 조회',
    description: `회원 리스트 조회`,
  })
  async userListGet(@Query() dto: GetUserListAdminDto): Promise<PaginationResultType<UserListDto>> {
    const [list, totalCount] = await this.usersService.getListByAdmin(dto);
    return infinityPagination({
      instance: UserListDto,
      list: list,
      totalCount: totalCount,
      page: dto.page,
      limit: dto.limit,
    });
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '회원 상세조회',
    description: `회원 상세조회'`,
  })
  async userDetailGet(@Admin() admin: IAdminSession, @Query() dto: GetUserDetailDto): Promise<UserDetailDto> {
    const result = await this.usersService.getDetail(dto);
    return plainToInstance(UserDetailDto, result);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '회원 생성',
    description: `회원 생성`,
  })
  async userPost(@Admin() admin: IAdminSession, @Body() dto: PostUserAdminDto): Promise<boolean> {
    return await this.usersService.createByAdmin(dto);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '회원 수정',
    description: `회원 수정`,
  })
  async userPatch(@Admin() admin: IAdminSession, @Body() dto: PatchUserAdminDto): Promise<boolean> {
    return await this.usersService.updateByAdmin(dto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '회원 삭제',
    description: `회원 삭제`,
  })
  async userDelete(@Admin() admin: IAdminSession, @Body() dto: DeleteUserDto): Promise<boolean> {
    return await this.usersService.delete(dto.id);
  }
}
