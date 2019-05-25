import { Controller, Injectable, Inject, Post, Body, HttpException, HttpStatus, Res } from '@nestjs/common'
import { InjectSchedule, Schedule } from 'nest-schedule'
import * as admin from 'firebase-admin'
import * as jwt from 'jsonwebtoken'

import { NotificationsService } from './notifications.service'
import { RegisterUserDto } from './dto/RegisterUser.dto'
import { LoginUserDto } from './dto/LoginUser.dto'
import { EmailActivationDto } from './dto/EmailActivation.dto'
import { ConfigService } from '../../services/config/config.service'
import { UserFsModel, UserSessionModel } from '../../models'
import { hashPasswordAsync, checkPasswordAsync } from '../../common/helpers/PasswordHelper'

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('Firestore') private fs: admin.firestore.Firestore,
    @Inject('ConfigService') private config: ConfigService,
    @Inject('NotificationsService') private notification: NotificationsService,
    @InjectSchedule() private readonly schedule: Schedule,
  ) {}

  @Post('/register')
  async register(@Body() registerUser: RegisterUserDto): Promise<HttpException> {
    const { email, password } = registerUser
    
    const res = await this.fs.collection('users').where('email', '==', email).get()
    if (res.docs.length !== 0) {
      throw new HttpException('User with that email already exist.', HttpStatus.BAD_REQUEST)
    }

    try {
      const { hash: passwordHash, salt: passwordSalt }: { hash: string, salt: string } = await hashPasswordAsync(password, 40)
      const { hash: activationHash, salt: activationSalt }: { hash: string, salt: string } = await hashPasswordAsync(email)
      const addUserRes: any = await this.fs.collection('users').add({...new UserFsModel({
        email,
        passwordSalt,
        passwordHash,
        activationSalt,
      })})

      await this.notification.sendRegistrationEmail(email, activationHash)
      this.schedule.scheduleTimeoutJob('activation-token-expiration', 10000, (): any => {
        this.fs.collection('users').doc(addUserRes.id).update({
          activationSalt: null,
        })
        
      })

      return new HttpException('User has been created', HttpStatus.OK)
    } catch(err) {
      throw new HttpException('Creating user went wrong.', HttpStatus.GONE)
    }
  }

  @Post('/login')
  async login(@Body() loginUser: LoginUserDto): Promise<string> {
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
  async activate(@Body() activation: EmailActivationDto): Promise<HttpException> {
    const { activationToken, email } = activation

    const queryRes = await this.fs.collection('users').where('email', '==', email).limit(1).get()
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
}
