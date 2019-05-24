import { Module } from '@nestjs/common'

import { AuthController } from './auth.controller'

import { FirebaseModule } from '../../common2/firebase/firebase.module'
import { ConfigModule } from '../../common2/config/config.module'
import { MailerModule } from '../../common2/mailer/mailer.module'

@Module({
  imports: [FirebaseModule, ConfigModule, MailerModule],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule {}
