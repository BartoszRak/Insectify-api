import { Module } from '@nestjs/common'

import { MailerService } from './mailer.service'
import { ConfigModule } from '../config/config.module'

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [MailerService],
  exports: [MailerService],
})

export class MailerModule {}

