import { Injectable } from '@nestjs/common'

import { BaseStorage } from './database/base-storage'
import { FirestoreRepository } from './database/firestore-repository'

import { User, Role } from '../../graphql.schema'

@Injectable()
export class StorageService extends BaseStorage {

  constructor() {
    super()
    this.initStorage()
  }

  public users: FirestoreRepository<User>
  public roles: FirestoreRepository<Role>

  private async initStorage(): Promise<void> {
    await this.connect()
    console.log('[Storage] Connected.')

    this.users = new FirestoreRepository<User>(this.fs, 'users')
    this.roles = new FirestoreRepository<Role>(this.fs, 'roles')
  
    console.log('[Storage] Repositories initialized.')
  }
}
