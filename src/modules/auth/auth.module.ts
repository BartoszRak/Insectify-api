import { Module } from '@nestjs/common'

import { FirebaseModule } from '../../common/firebase/firebase.module'
import { AuthController } from './auth.controller'

@Module({
  imports: [FirebaseModule],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule {}