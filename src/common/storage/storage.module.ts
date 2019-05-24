import { Module } from '@nestjs/common'

import { FirebaseModule } from '../firebase/firebase.module'
import { StorageService } from './storage.service'


@Module({
  imports: [FirebaseModule],
  controllers: [],
  providers: [StorageService],
  exports: [StorageService],
})

export class StorageModule {}
