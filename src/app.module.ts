import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import { ConfigModule } from './services/config/config.module'
import { AuthModule } from './modules/auth/auth.module'
import { LoggerMiddleware } from './services/middleware/logger.middleware'

@Module({
  imports: [ConfigModule, AuthModule],
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
