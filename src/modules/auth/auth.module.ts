import { Module } from '@nestjs/common'

import { AuthController } from './auth.controller'

import { FirebaseModule } from '../../common/firebase/firebase.module'
import { ConfigModule } from '../../common/config/config.module'
import { MailerModule } from '../../common/mailer/mailer.module'

@Module({
  imports: [FirebaseModule, ConfigModule, MailerModule],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule {}
