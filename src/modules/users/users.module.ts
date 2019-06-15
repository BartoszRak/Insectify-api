import { Module } from '@nestjs/common'

import { StorageModule } from '../storage/storage.module'
import { UsersResolvers } from './users.resolvers'

@Module({
  imports: [StorageModule],
  providers: [UsersResolvers],
  exports: [],
})
export class UsersModule {}