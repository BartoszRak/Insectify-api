import { Inject, Injectable } from '@nestjs/common'
import * as Express from 'express'
import { get } from 'lodash'

import { StorageService } from '../storage/storage.service'
import { Role } from '../../graphql.schema'

@Injectable()
export class RolesService {
  constructor(
    @Inject('StorageService') private readonly storage: StorageService,
  ) {}

  public async getAllRoles(req: Express.Request): Promise<Role[]> {
    const permissions: any = req['permissions']
    let roles: Role[] = await this.storage.roles.getAll()
    if (!get(permissions, 'roles.getAll.all')) {
      roles = roles.filter((role: Role) => (role.name !== 'superadmin' && role.name !== 'admin'))
    }
    return roles
  }
}