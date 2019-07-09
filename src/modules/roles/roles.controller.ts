import { Req, Controller, Injectable, Inject, Get } from '@nestjs/common'
import * as Express from 'express'

import { Role } from '../../graphql.schema'
import { RolesService } from './roles.service'
import { Permissions } from '../../decorators'

@Injectable()
@Controller('roles')
export class RolesController {
  constructor(
    @Inject('RolesService') private readonly roles: RolesService,
  ) {}

  @Permissions(['roles.getAll'])
  @Get()
  public async register(@Req() req: Express.Request): Promise<Role[]> {
    console.log('===> controller', req)
    return this.roles.getAllRoles(req)
  }
}
