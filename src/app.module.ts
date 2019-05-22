import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import { ConfigModule } from './common/config/config.module'
import { StorageModule } from './common/storage/storage.module'
import { LoggerMiddleware } from './common/middleware/logger.middleware'

@Module({
  imports: [ConfigModule, StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })
  }
}
