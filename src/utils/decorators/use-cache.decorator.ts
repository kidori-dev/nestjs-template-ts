import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { API_CACHE_TIME } from '../../constants/codes';

export function UseCache(ttl: number = API_CACHE_TIME) {
  const decorators = [UseInterceptors(CacheInterceptor)];
  decorators.push(CacheTTL(ttl));
  return applyDecorators(...decorators);
}
