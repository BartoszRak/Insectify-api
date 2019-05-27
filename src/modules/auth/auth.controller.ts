import { Controller, Injectable, Inject, Post, Body, HttpException, HttpStatus, Get } from '@nestjs/common'
import * as admin from 'firebase-admin'
import * as jwt from 'jsonwebtoken'

import { NotificationsService } from './notifications.service'
import { ConfigService } from '../../services/modules/config/config.service'
import { ActivationService } from './activation.service'
import { RegisterUserDto, LoginUserDto, ActivationDto, RequestActivationDto } from './dto'
import { UserFsModel, UserSessionModel } from '../../models'
import { hashPasswordAsync, checkPasswordAsync } from '../../common/helpers/PasswordHelper'
import { Protected } from '../../decorators'

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('Firestore') private fs: admin.firestore.Firestore,
    @Inject('ConfigService') private config: ConfigService,
    @Inject('NotificationsService') private notification: NotificationsService,
    @Inject('ActivationService') private activation: ActivationService,
  ) {}

  @Post('/register')
  public async register(@Body() registerUser: RegisterUserDto): Promise<HttpException> {
    const { email, password } = registerUser
    
    const res = await this.fs.collection('users').where('email', '==', email).get()
    if (res.docs.length !== 0) {
      throw new HttpException('User with that email already exists.', HttpStatus.BAD_REQUEST)
    }

    try {
      const { hash: passwordHash, salt: passwordSalt }: { hash: string, salt: string } = await hashPasswordAsync(password, 40)

      await this.fs.collection('users').add({...new UserFsModel({
        email,
        passwordSalt,
        passwordHash,
        activationSalt: null,
      })})
      await this.notification.sendRegistrationEmail(email)
      await this.activation.requestActivation(email)

      return new HttpException('User has been created', HttpStatus.OK)
    } catch(err) {
      throw new HttpException('Creating user went wrong.', HttpStatus.GONE)
    }
  }

  @Post('/login')
  public async login(@Body() loginUser: LoginUserDto): Promise<string> {
    const { email, password } = loginUser

    const queryRes = await this.fs.collection('users').where('email', '==', email).limit(1).get()
    if (queryRes.docs.length === 0) {
      throw new HttpException('There is no user with that email assigned.', HttpStatus.BAD_REQUEST)
    }
    const user: UserFsModel = new UserFsModel(queryRes.docs[0].data())
    const { passwordHash, passwordSalt } = user
    const isPasswordValid: boolean = await checkPasswordAsync(password, passwordSalt, passwordHash)
    if(!isPasswordValid) {
      throw new HttpException('Password or email is invalid', HttpStatus.GONE)
    }

    const session: any = {
      user: new  UserSessionModel(user)
    }

    const token: string = await jwt.sign({
      data: session,
    }, this.config.get('JWT_SECRET'), {
      algorithm: 'HS256',
      expiresIn: 3600,
    })
  
    return token
  }

  @Post('/activate')
  public async activate(@Body() activation: ActivationDto): Promise<HttpException> {
    const { activationToken, email } = activation

    const queryRes: any = await this.fs.collection('users').where('email', '==', email).limit(1).get()
    if (queryRes.docs.length === 0) {
      throw new HttpException('Activation failed. There is no user with that email assigned.', HttpStatus.BAD_REQUEST)
    }

    const user: UserFsModel = new UserFsModel(queryRes.docs[0].data())
    const { activationSalt } = user

    const isTokenValid: boolean = await checkPasswordAsync(email, activationSalt, activationToken)
    if(!isTokenValid) {
      throw new HttpException('Activation token is invalid or outdated.', HttpStatus.BAD_REQUEST)
    }

    try {
      this.fs.collection('users').doc(queryRes.docs[0].ref.id).update({
        isEmailConfirmed: true,
        activationSalt: null,
      })
      return new HttpException('Activation successful.', HttpStatus.OK)
    } catch(err) {
      throw new HttpException('Activation process failed.', HttpStatus.GONE)
    }
  }

  @Post('/requestActivation')
  public async requestActivation(@Body() requestActivation: RequestActivationDto): Promise<any> {
    const { email } = requestActivation
    try {
      await this.activation.requestActivation(email)
      return new HttpException('Activation has been requested successfully.', HttpStatus.OK)
    } catch(err) {
      console.log(err)
      throw new HttpException('Requesting new activation process failed.', HttpStatus.GONE)
    }
  }

  @Get('/isAuth')
  @Protected()
  public async isAuth(): Promise<any> {
    return true
  }
}
