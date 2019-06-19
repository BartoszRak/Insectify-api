import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

import { NotificationsService } from './notifications.service'
import { ActivationService } from './activation.service'
import { StorageService } from '../storage/storage.service'
import { hashPasswordAsync, checkPasswordAsync } from '../../common/helpers/PasswordHelper'
import { User } from '../../graphql.schema'
import { RegisterUserDto, LoginUserDto, ActivationDto, RequestActivationDto } from './dto'
import { SessionModel } from './models/session.model'
import { jwtSecret } from '../../config'

@Injectable()
export class AuthService {
  constructor(
    @Inject('NotificationsService') private readonly notification: NotificationsService,
    @Inject('ActivationService') private readonly activation: ActivationService,
    @Inject('StorageService') private readonly storage: StorageService,
  ) {}

  public async register(user: RegisterUserDto): Promise<any> {
    const { email, password, firstName, lastName, postCode, city, region, country, houseNumber, flatNumber, street } = user
    const res: User[] = await this.storage.users.getList({
      limit: 1,
      where: {
        email: {
          $eq: email,
        },
      }
    })
    if (res.length !== 0) {
      throw new HttpException('User with that email already exists.', HttpStatus.BAD_REQUEST)
    }

    try {
      const { hash: passwordHash, salt: passwordSalt }: { hash: string, salt: string } = await hashPasswordAsync(password, 40)
      await this.storage.users.insertOne({
        firstName,
        lastName,
        email,
        passwordSalt,
        passwordHash,
        activationSalt: null,
        isEmailConfirmed: false,
        roles: ['user'],
        adress: {
          postCode,
          city,
          region,
          country,
          houseNumber,
          flatNumber,
          street,
        }
      } as User)
      await this.notification.sendRegistrationEmail(email)
      await this.activation.requestActivation(email)

      return new HttpException('User has been created', HttpStatus.OK)
    } catch(err) {
      throw new HttpException(`Creating user went wrong. ${err.message}`, HttpStatus.GONE)
    }
  }

  public async login(user: LoginUserDto): Promise<any> {
    const { email, password } = user

    const queryRes = await this.storage.users.getList({
      limit: 1,
      where: {
        email: {
          $eq: email,
        },
      },
    })
    
    if (queryRes.length === 0) {
      throw new HttpException('There is no user with that email assigned.', HttpStatus.BAD_REQUEST)
    }

    const fetchedUser: User = { ...queryRes[0] } as User
    const { passwordHash, passwordSalt, isEmailConfirmed } = fetchedUser
    if (!isEmailConfirmed) {
      throw new HttpException('Account has not been activated.',HttpStatus.BAD_REQUEST)
    }

    const isPasswordValid: boolean = await checkPasswordAsync(password, passwordSalt, passwordHash)
    if (!isPasswordValid) {
      throw new HttpException('Password or email is invalid', HttpStatus.GONE)
    }

    const session: any = new SessionModel({ ...user })
    const token: string = await jwt.sign({
      data: session,
    }, jwtSecret, {
      algorithm: 'HS256',
      expiresIn: 3600,
    })
  
    return token
  }

  public async activate(activation: ActivationDto): Promise<any> {
    const { activationToken, email } = activation

    const queryRes: any = await this.storage.users.getList({
      limit: 1,
      where: {
        email: {
          $eq: 'rak.bartosz98@gmail.com',
        },
      },
    })

    if (queryRes.length === 0) {
      throw new HttpException('Activation failed. There is no user with that email assigned.', HttpStatus.BAD_REQUEST)
    }
    const user: User = { ...queryRes[0] } as User
    const { activationSalt, isEmailConfirmed } = user
    if (isEmailConfirmed) {
      throw new HttpException('Account is already active.', HttpStatus.BAD_REQUEST)
    }
    const isTokenValid: boolean = await checkPasswordAsync(email, activationSalt, activationToken)
    if(!isTokenValid) {
      throw new HttpException('Activation token is invalid or outdated.', HttpStatus.BAD_REQUEST)
    }
    try {
      await this.storage.users.updateOne({
        ...user,
        isEmailConfirmed: true,
        activationSalt: null,
      }, {
        _id: user.id,
      })
      return new HttpException('Activation successful.', HttpStatus.OK)
    } catch(err) {
      throw new HttpException('Activation process failed.', HttpStatus.GONE)
    }
  }

  public async requestActivation(request: RequestActivationDto): Promise<any> {
    const { email } = request
    try {
      await this.activation.requestActivation(email)
      return new HttpException('Activation has been requested successfully.', HttpStatus.OK)
    } catch(err) {
      throw new HttpException('Requesting new activation process failed.', HttpStatus.GONE)
    }
  }
}