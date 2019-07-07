import { Injectable, Inject } from '@nestjs/common'

import { BaseStorage } from './database/base-storage'
import { Repository } from './database/repository'

import { User, Role } from '../../graphql.schema'

@Injectable()
export class StorageService extends BaseStorage {

  constructor() {
    super()
    this.initStorage()
  }

  public users: Repository<User>
  public roles: Repository<Role>

  private async initStorage(): Promise<void> {
    await this.connect()
    console.log('[Storage] Connected.')

    this.users = new Repository<User>(this.db, 'users')
    this.roles = new Repository<Role>(this.db, 'roles')
  
    console.log('[Storage] Repositories initialized.')
  }
}
