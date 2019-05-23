import { Controller, Injectable, Inject, Post } from '@nestjs/common'
import * as admin from 'firebase-admin'

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('Firestore') private fs: admin.firestore.Firestore
  ) {}

  @Post('/register')
  async register() {
    console.log(this.fs)
    return 'register'
  }
}