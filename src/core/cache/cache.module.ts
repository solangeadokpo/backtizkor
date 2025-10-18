import { Module, Global } from "@nestjs/common";
import { RedisCacheProvider } from "./redis/redis.providers";
import { RedisCacheService } from "./redis/redis-cache.service";

@Global()
@Module({
  imports: [RedisCacheProvider],
  providers: [RedisCacheService],
  exports: [RedisCacheProvider, RedisCacheService],
})
export class RedisCacheModule {}
