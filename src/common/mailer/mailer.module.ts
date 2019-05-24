import { Module } from '@nestjs/common'

import { mailerProviders } from './mailer.provider'
import { ConfigModule } from '../config/config.module'

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [...mailerProviders],
  exports: [...mailerProviders],
})

export class MailerModule {}

