import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import { ConfigModule } from './common/config/config.module'
import { StorageModule } from './common/storage/storage.module'

@Module({
  imports: [ConfigModule, StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
