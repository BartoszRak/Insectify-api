import { Module } from '@nestjs/common'

import { StorageModule } from '../storage/storage.module'
import { RolesResolvers } from './roles.resolvers'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'

@Module({
  imports: [StorageModule],
  controllers: [RolesController],
  providers: [RolesService, RolesResolvers],
})
export class RolesModule {}