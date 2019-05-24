import { Module } from '@nestjs/common'
import { ConfigService } from './config.service'
import { configProviders } from './config.provider'

@Module({
  providers: [ConfigService, ...configProviders],
  exports: [ConfigService, ...configProviders],
})
export class ConfigModule {}