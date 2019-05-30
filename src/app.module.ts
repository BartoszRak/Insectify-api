import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import { StorageModule } from './modules/storage/storage.module'
import { ConfigModule } from './modules/config/config.module'
import { AuthModule } from './modules/auth/auth.module'
import { LoggerMiddleware } from './middleware/logger.middleware'

@Module({
  imports: [ConfigModule, AuthModule, StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      })
  }
}
