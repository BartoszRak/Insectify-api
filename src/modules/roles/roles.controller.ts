import { Controller, Injectable, Inject, Get } from '@nestjs/common'

import { Role } from '../../graphql.schema'
import { RolesService } from './roles.service'
import { Permissions } from '../../decorators'

@Injectable()
@Controller('roles')
export class RolesController {
  constructor(
    @Inject('RolesService') private readonly roles: RolesService,
  ) {}

  @Permissions(['roles.get'])
  @Get()
  public async register(): Promise<Role[]> {
    return this.roles.getAllRoles()
  }
}
