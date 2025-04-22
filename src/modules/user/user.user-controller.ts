import {Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {UserDetailDto} from './dto/response/user-detail.dto';
import {PostUserUserDto} from './dto/request/post-user.user-dto';
import {PaginationResultType} from '../../utils/types/pagination-result.type';
import {UserListDto} from './dto/response/user-list.dto';
import {GetUserDetailDto} from './dto/request/get-user-detail.dto';
import {UserAuthGuard} from '../auth/session/user-auth.guard';
import {User} from '../../utils/decorators/user.decorator';
import {IUserSession} from '../../utils/types/auth-user.interface';
import {PatchUserUserDto} from './dto/request/patch-user.user-dto';
import {Roles} from './guard/roles.decorator';
import {RolesGuard} from './guard/roles.guard';
import {UserRoleEnum} from '../../constants/enums';
import {GetUserListUserDto} from './dto/request/get-user-list.user-dto';
import {plainToInstance} from 'class-transformer';
import {infinityPagination} from '../../utils/infinity-pagination';

@ApiTags('회원관리 (유저)')
@Controller({
  path: 'user/member',
  version: '1',
})
export class UserUserController {
  constructor(private readonly usersService: UserService) {
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserAuthGuard)
  @ApiOperation({
    summary: '회원 리스트 조회',
    description: `회원 리스트 조회`,
  })
  async userListGet(
    @User() user: IUserSession,
    @Query() dto: GetUserListUserDto,
  ): Promise<PaginationResultType<UserListDto>> {
    const [list, totalCount] = await this.usersService.getListByUser(dto, user.id);
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
  @UseGuards(UserAuthGuard)
  @ApiOperation({
    summary: '회원 상세조회',
    description: `회원 상세조회'`,
  })
  async userDetailGet(@User() user: IUserSession, @Query() dto: GetUserDetailDto): Promise<UserDetailDto> {
    const result = await this.usersService.getDetail({...dto, id: user.id});
    return plainToInstance(UserDetailDto, result);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '회원 생성',
    description: `회원 생성`,
  })
  async userPost(@Body() dto: PostUserUserDto): Promise<boolean> {
    return await this.usersService.create(dto);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserAuthGuard)
  @ApiOperation({
    summary: '회원 수정',
    description: `회원 수정`,
  })
  async userPatch(@User() user: IUserSession, @Body() dto: PatchUserUserDto): Promise<boolean> {
    return await this.usersService.updateByUser(dto, user.id);
  }

  // @Delete()
  // @HttpCode(HttpStatus.OK)
  // @UseGuards(UserAuthGuard)
  // @ApiOperation({
  //   summary: '회원 삭제',
  //   description: `회원 삭제`,
  // })
  // async userDelete(@User() user: IUserSession, @Body() dto: DeleteUserDto): Promise<boolean> {
  //   return await this.usersService.delete(dto.id);
  // }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '초대 코드 검사',
    description: `초대 코드 검사`,
  })
  async codeInviteCodeGet(@Param('code') inviteCode: string): Promise<boolean> {
    return await this.usersService.checkInviteCode(inviteCode);
  }

  /** 매니저인지 아닌지 Roles 으로 구분지을수 있음 */
  @Get('role-test')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoleEnum.MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: '권한테스트',
    description: `권한테스트`,
  })
  async test() {
    return true;
  }
}
