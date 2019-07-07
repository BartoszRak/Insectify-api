import { Inject } from '@nestjs/common'
import { Resolver, Query } from '@nestjs/graphql'

import { RolesService } from './roles.service'
import { Permissions } from '../../decorators'
import { Role } from '../../graphql.schema'

@Resolver('Role')
export class RolesResolvers {
  constructor(
    @Inject('RolesService') private readonly roles: RolesService,
  ) {}

  @Permissions(['roles.get'])
  @Query('getRoles')
  public async getRoles(): Promise<Role[]> {
    const roles: Role[] = await this.roles.getAllRoles()
    return roles
  }
}