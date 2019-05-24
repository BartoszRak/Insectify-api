import { Controller, Injectable, Inject, Post, Body, HttpException, HttpStatus, Res } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import * as admin from 'firebase-admin'
import * as jwt from 'jsonwebtoken'

import { ConfigService } from '../../common2/config/config.service'
import { RegisterUserDto } from './dto/RegisterUser.dto'
import { LoginUserDto } from './dto/LoginUser.dto'
import { UserFsModel, UserSessionModel } from '../../models'
import { hashPasswordAsync, checkPasswordAsync } from '../../common/helpers/PasswordHelper'
import { MailerService } from '../../common2/mailer/mailer.service'

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('Firestore') private fs: admin.firestore.Firestore,
    @Inject('ConfigService') private config: ConfigService,
    @Inject('MainMailer') private mailer: MailerService,
  ) {}

  @Post('/register')
  async register(@Body() registerUser: RegisterUserDto): Promise<HttpException> {
    const { email, password } = registerUser
    
    const res = await this.fs.collection('users').where('email', '==', email).get()
    if (res.docs.length !== 0) {
      throw new HttpException('User with that email already exist.', HttpStatus.BAD_REQUEST)
    }

    try {
      const { hash, salt }: { hash: string, salt: string } = await hashPasswordAsync(password)
      this.fs.collection('users').add({...new UserFsModel({
        email,
        salt,
        passwordHash: hash,
      })})

      const mailOptions: nodemailer.SendMailOptions = {
        date: new Date(),
        from: 'Insectify Shop',
        headers: {
          'Content-type': 'text/html; charset=UTF-8',
        },
        html: `
        <h1>Insectiy Shop</h1>
        <h2>Your account has been created!</h2>
        `,
        priority: 'normal',
        subject: 'Insectify - Your account has been created!',
        to: email,
      }

      await this.mailer.send(mailOptions)
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
    const { passwordHash, salt } = user
    const isPasswordValid: boolean = await checkPasswordAsync(password, salt, passwordHash)
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
}
