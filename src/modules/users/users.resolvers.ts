import { Inject } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { StorageService } from '../storage/storage.service'

@Resolver('User')
export class UsersResolvers {
  constructor(
    @Inject('StorageService') private readonly storage: StorageService,
  ) {}

  @Query()
  async getUserById(
    @Args('id')
    id: string,
  ): Promise<any> {
    const res: any[] = await this.storage.users.getOne(id)
    return res
  }

}