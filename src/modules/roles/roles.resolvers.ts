import { Inject } from '@nestjs/common'
import { Resolver, Query, Context } from '@nestjs/graphql'
import * as Express from 'express'

import { RolesService } from './roles.service'
import { Permissions } from '../../decorators'
import { Role } from '../../graphql.schema'

@Resolver('Role')
export class RolesResolvers {
  constructor(
    @Inject('RolesService') private readonly roles: RolesService,
  ) {}

  @Permissions(['roles.getAll'])
  @Query('getRoles')
  public async getRoles(@Context() ctx): Promise<Role[]> {
    return this.roles.getAllRoles(ctx)
  }
}