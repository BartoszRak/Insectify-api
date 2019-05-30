import { Injectable, Inject } from '@nestjs/common'
import * as mongoose from 'mongoose'

import { BaseStorage } from './database/BaseStorage'
import { Repository } from './database/Repository'

import { UserDbModel } from '../../models'

@Injectable()
export class StorageService extends BaseStorage {

  public users: Repository<UserDbModel>

  protected initDb(): void {
    this.users = new Repository<UserDbModel>(this.db, 'users')
  }
}
