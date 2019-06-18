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
    const result: User = await this.storage.users.getOne(id)
    return result
  }

  @Query()
  async users(
    @Args('limit')
    limit: number,
    @Args('where')
    where: { [key: string]: string[] },
  ): Promise<User[]> {
    const result: User[] = await this.storage.users.getList({
      limit,
      where,
    })
    return result
  }

}