import { Module } from '@nestjs/common'

import { AuthController } from './auth.controller'

import { FirebaseModule } from '../../services/firebase/firebase.module'
import { ConfigModule } from '../../services/config/config.module'
import { MailerModule } from '../../services/mailer/mailer.module'

@Module({
  imports: [FirebaseModule, ConfigModule, MailerModule],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule {}
