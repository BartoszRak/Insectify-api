import { Injectable, Inject, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext, GraphQLExecutionContext } from '@nestjs/graphql'
import { Express } from 'express'
import * as jwt from 'jsonwebtoken'

import { jwtSecret } from '../../config'
import { User } from '../../graphql.schema'
import { StorageService } from '../../modules/storage/storage.service'
import { Role } from '../../graphql.schema'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    @Inject('StorageService') private readonly storage: StorageService,
    private readonly reflector: Reflector,
  ) {}

  protected initialized: boolean = false
  protected roles: Role[]

  protected init() {
    try {
      this.storage.roles.onChange((data: any) => {
        this.roles = data
      })
      this.initialized = true
    } catch (err) {
      console.log(`[Permissions Guard] Init error: ${err.message}`)
    }
  }

  public async canActivate(
    ctx: ExecutionContext,
  ): Promise<boolean> {
    if (!this.initialized) {
      this.init()
    }
    const graphqlCtx: GraphQLExecutionContext = GqlExecutionContext.create(ctx)
    const request: any = ctx.switchToHttp().getRequest() || graphqlCtx.getContext()
    const requiredPermissions: string[] = this.reflector.get<string[]>('requiredPermissions', ctx.getHandler())
    if (!Boolean(requiredPermissions)) {
      return true
    }
    const header: any = request.headers
    if (!header.authorization) {
      return false
    }
    const token: string = header.authorization.slice(7)
    const decodedToken: any = await jwt.verify(token, jwtSecret)
    const user: User = decodedToken.data.user
    console.log(user)
    console.log(requiredPermissions)
    return true
  }
}
