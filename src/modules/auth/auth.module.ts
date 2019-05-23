import { Module } from '@nestjs/common'

import { FirebaseModule } from '../../common/firebase/firebase.module'
import { ConfigModule } from '../../common/config/config.module'
import { AuthController } from './auth.controller'

@Module({
  imports: [FirebaseModule, ConfigModule],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule {}