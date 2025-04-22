import {Controller, Get, HttpCode, HttpStatus} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {AppInfoService} from './app-info.service';
import {BankAccountDto} from './dto/response/bank-account.dto';
import {UseCache} from '../../utils/decorators/use-cache.decorator';
import {plainToInstance} from 'class-transformer';

@ApiTags('플랫폼 정보')
@Controller({
  path: 'info',
  version: '1',
})
export class AppInfoController {
  constructor(private readonly appInfoService: AppInfoService) {
  }

  @Get('bank-account')
  @UseCache()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '플랫폼 입금 계좌',
    description: `플랫폼 입금 계좌`,
  })
  async bankAccountGet(): Promise<BankAccountDto> {
    const result = await this.appInfoService.getBankAccount();
    return plainToInstance(BankAccountDto, result);
  }
}
