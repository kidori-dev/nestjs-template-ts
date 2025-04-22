import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as os from 'os';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@ApiTags('Health')
@Controller({
  path: 'health',
  version: '1',
})
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: TypeOrmHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('check')
  @HealthCheck()
  async checkBasic() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }

  @Get('all')
  @HealthCheck()
  async checkAll() {
    const storagePath = os.platform().includes('win') ? 'C:\\' : '/';
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.disk.checkStorage('storage', { path: storagePath, thresholdPercent: 0.5 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }
}
