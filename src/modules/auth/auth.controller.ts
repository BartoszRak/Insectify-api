import { Controller, Injectable, Inject, Post, Body, BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
import * as admin from 'firebase-admin'

import { RegisterUserDto } from './dto/RegisterUser.dto'
import { hashPasswordAsync } from '../../services/helpers/PasswordHelper'
import { UserFsModel } from '../../common/firebase/models'

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('Firestore') private fs: admin.firestore.Firestore
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
      return new HttpException('User has been created', HttpStatus.OK)
    } catch(err) {
      throw new HttpException('Creating user went wrong.', HttpStatus.GONE)
    }
  }
}