import { Inject } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { StorageService } from '../storage/storage.service'

import { User } from '../../graphql.schema'

@Resolver('User')
export class UsersResolvers {
  constructor(
    @Inject('StorageService') private readonly storage: StorageService,
  ) {}

  @Query()
  async userById(
    @Args('id')
    id: string,
  ): Promise<User> {
    return this.storage.users.getOne(id)
  }

  @Query()
  async users(
    @Args('limit')
    limit: number,
    @Args('where')
    where: any[],
  ): Promise<User[]> {
    return this.storage.users.getList({
      limit,
      where,
    })
  }

}