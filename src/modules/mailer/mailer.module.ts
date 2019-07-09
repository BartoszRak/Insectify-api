import { Module } from '@nestjs/common'

import { mailerProviders } from './mailer.provider'

@Module({
  providers: [...mailerProviders],
  exports: [...mailerProviders],
})

export class MailerModule {}

