import { Injectable, Inject } from '@nestjs/common'

import { BaseStorage } from './database/BaseStorage'
import { Repository } from './database/Repository'

import { UserDbModel } from '../../models'

@Injectable()
export class StorageService extends BaseStorage {

  constructor() {
    super()
    this.initStorage()
  }

  public users: Repository<UserDbModel>

  private async initStorage(): Promise<void> {
    await this.connect()
    console.log('# Storage == Connected.')

    this.users = new Repository<UserDbModel>(this.db, 'users')
    console.log('# Storage == Repositories initialized.')
  }
}
