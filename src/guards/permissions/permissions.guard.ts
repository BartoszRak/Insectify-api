import { Injectable, Inject, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext, GraphQLExecutionContext } from '@nestjs/graphql'
import * as jwt from 'jsonwebtoken'
import * as memoize from 'memoizee'

import { jwtSecret } from '../../config'
import { User } from '../../graphql.schema'
import { StorageService } from '../../modules/storage/storage.service'
import { Role } from '../../graphql.schema'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    @Inject('StorageService') private readonly storage: StorageService,
    private readonly reflector: Reflector,
  ) {
    this.init()
  }

  private roles: Role[] = []

  private async init() {
    try {
      this.storage.roles.onChange((data: any) => {
        this.roles = data
      })
      console.log(`[Permissions Guard] Initialized.`)
    } catch (err) {
      console.log(`[Permissions Guard] Init error: ${err.message}.`)
      await new Promise((resolve: any, reject: any) => {
        try {
          setTimeout(() => {
            this.init()
            resolve()
          }, 1000)
        } catch(err) {
          reject()
        }
      })
    }
  }

  private createInfinityProxy() {
    return new Proxy({}, {
      get: () => this.createInfinityProxy()
    })
  }

  private mapPermissionsArrayToObject(userPermissionsArray: string[]): any {
    return memoize((userPermissions: string[]) => {
      return userPermissions.reduce((userPermissionsObject: any, permissionsString: string): any => {
        const permissionsArray: string[] = permissionsString.split('.')
        let ref: any = userPermissionsObject
        permissionsArray.forEach((permission: string, index: number) => {
          const nextPermOrActual: any = permissionsArray.length <= 1 ? permission : permissionsArray[index + 1]
          const baseObj: any = ref[permission] || {}
          const proxy: any =  new Proxy(baseObj, {
            get: (target, name) => target['*'] ? this.createInfinityProxy() : target[name]
          })
          const readyObj: any = nextPermOrActual === '*' ? proxy : baseObj
  
          ref[permission] = Boolean(permission === '*') || readyObj
          ref = ref[permission]
        })
        return userPermissionsObject
      }, {})
    })(userPermissionsArray)
  }


  private getUserPermissions(user: User) {
    return this.roles.reduce((permissionsArray: string[], role: Role) => {
      return user.roles[role.name]
      ? [ ...permissionsArray, ...Object.keys(role.permissions).filter(key => Boolean(role.permissions[key])).map(key => key)]
      : permissionsArray
    }, [])
  }
  

  private hasAccess(requiredPermissionsArray: string[], userPermissionsObject: any): boolean {
    return memoize((requiredPermissions: string[], userPermissionsObj: any): boolean => {
      const requiredPermissionsArray: string[][] = requiredPermissions.map((perm: string): string[] => perm.split('.'))
      let accessFlag: boolean = true
  
      requiredPermissionsArray.some((requiredPermission: string[]): boolean => {
        if (!accessFlag) return true
  
        let ref: any = userPermissionsObj
        requiredPermission.some((permission: string): boolean => {
          if (ref['*']) return true
          if (!ref[permission]) {
            accessFlag = false
            return true
          }
          ref = ref[permission]
        })
      })
  
      return accessFlag
    })(requiredPermissionsArray, userPermissionsObject)
  }

  public async canActivate(
    ctx: ExecutionContext,
  ): Promise<boolean> {
    try {
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
      const userPermissions: string[] = this.getUserPermissions(user)
      const userPermissionsObj: any = this.mapPermissionsArrayToObject(userPermissions)
    
      if (!this.hasAccess(requiredPermissions, userPermissionsObj)) {
        throw new UnauthorizedException('You are missing some permissions to access this resource.')
      }

      request.permissions = userPermissionsObj
      request.user = user

      return true
    } catch (err) {
      throw new UnauthorizedException(err.message)
    }
  }
}