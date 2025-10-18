import { CacheModule } from "@nestjs/cache-manager";
import { RedisConfigModule } from "src/config/redis/config.module";
import { RedisConfigService } from "src/config/redis/config.service";
import { redisStore } from "cache-manager-ioredis";

export const RedisCacheProvider = CacheModule.registerAsync({
  isGlobal: true,
  imports: [RedisConfigModule],
  inject: [RedisConfigService],
  useFactory: async (configService: RedisConfigService) => ({
    store: redisStore,
    host: configService.host,
    port: configService.port,
    ttl: configService.ttl,
  }),
});
