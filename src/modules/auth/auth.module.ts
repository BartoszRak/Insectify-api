import { Module } from '@nestjs/common'
import { ScheduleModule } from 'nest-schedule'

import { AuthController } from './auth.controller'
import { NotificationsService } from './notifications.service'
import { ActivationService } from './activation.service'

import { FirebaseModule } from '../firebase/firebase.module'
import { ConfigModule } from '../config/config.module'
import { MailerModule } from '../mailer/mailer.module'

@Module({
  imports: [FirebaseModule, ConfigModule, MailerModule, ScheduleModule.register()],
  controllers: [AuthController],
  providers: [NotificationsService, ActivationService],
  exports: [],
})
export class AuthModule {}
