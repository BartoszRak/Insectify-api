import { Module } from '@nestjs/common'

import { ConfigModule } from '../config/config.module'
import { firebaseProviders } from './firebase.provider'

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [...firebaseProviders],
  exports: [],
})
export class FirebaseModule {}
