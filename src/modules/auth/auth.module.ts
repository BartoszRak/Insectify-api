import { Module } from '@nestjs/common'
import { ScheduleModule } from 'nest-schedule'

import { AuthController } from './auth.controller'
import { NotificationsService } from './notifications.service'
import { ActivationService } from './activation.service'
import { AuthService } from './auth.service'

import { FirebaseModule } from '../firebase/firebase.module'
import { ConfigModule } from '../config/config.module'
import { MailerModule } from '../mailer/mailer.module'
import { StorageModule } from '../storage/storage.module'
import { AuthResolvers } from './auth.resolvers'

@Module({
  imports: [FirebaseModule, ConfigModule, MailerModule, StorageModule, ScheduleModule.register()],
  controllers: [AuthController],
  providers: [NotificationsService, ActivationService, AuthService, AuthResolvers],
  exports: [],
})
export class AuthModule {}
