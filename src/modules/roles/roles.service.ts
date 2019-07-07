import { Inject, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { StorageService } from '../storage/storage.service'
import { Role } from '../../graphql.schema'

@Injectable()
export class RolesService {
  constructor(
    @Inject('StorageService') private readonly storage: StorageService,
  ) {}

  public async getAllRoles(): Promise<Role[]> {
    const roles: Role[] = await this.storage.roles.getAll()
    return roles
  }
}