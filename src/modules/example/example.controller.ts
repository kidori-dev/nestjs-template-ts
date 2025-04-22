import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExampleService } from './example.service';
import { UserAuthGuard } from '../auth/session/user-auth.guard';

@ApiTags('Example')
@Controller({
  path: 'example',
  version: '1',
})
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserAuthGuard)
  @ApiOperation({
    summary: 'GET',
    description: `GET 요청 예제`,
  })
  async exampleGet(): Promise<string> {
    return await this.exampleService.exampleGet();
  }

  @Get('roles')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserAuthGuard)
  @ApiOperation({
    summary: 'GET',
    description: `GET 요청 예제`,
  })
  async exampleRolesGet(): Promise<string> {
    return await this.exampleService.exampleGet();
  }
}
