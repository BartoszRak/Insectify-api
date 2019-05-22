import { Module } from '@nestjs/common'
import { StorageService } from './storage.service'

import { ConfigModule } from '../Config/config.module'

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [StorageService],
})
export class StorageModule {}
