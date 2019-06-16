import { Injectable, Inject } from '@nestjs/common'

import { BaseStorage } from './database/BaseStorage'
import { Repository } from './database/Repository'

import { User } from '../../graphql.schema'

@Injectable()
export class StorageService extends BaseStorage {

  constructor() {
    super()
    this.initStorage()
  }

  public users: Repository<User>

  private async initStorage(): Promise<void> {
    await this.connect()
    console.log('[Storage] Connected.')

    this.users = new Repository<User>(this.db, 'users')
    console.log('[Storage] Repositories initialized.')
  }
}
