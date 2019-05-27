import { Inject, Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

import { DecodedToken } from './interfaces/decodedToken.interface'
import { ConfigService } from '../../modules/config/config.service'
import { Reflector } from '@nestjs/core'

@Injectable()
export class AccessGuard implements CanActivate {
  private readonly config: ConfigService = new ConfigService('./secrets.env')
  private readonly reflector: Reflector = new Reflector()

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isProtected = this.reflector.get('engageProtection', context.getHandler());
    
    if (!isProtected) return true
    
    const request = context.switchToHttp().getRequest()
    const authorization = request.headers.authorization

    console.log('ACESS GUARD')

    if (!authorization) throw new UnauthorizedException('You have to provide access-token!')

    try {
      const token: string = authorization.split('Bearer ')[1]
      const decodedToken: DecodedToken = await jwt.verify(token, this.config.get('JWT_SECRET'))
      const user = decodedToken.data.user
      console.log(user)
      // add permissions-based authorization here
    } catch(err) {
      throw new UnauthorizedException('You have no access to this resource!')
    }

    return true
  }
}