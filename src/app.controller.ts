import { Controller, Get, Post, Inject } from '@nestjs/common'

import { AppService } from './app.service'
import { StorageService } from './modules/storage/storage.service'
import { Protected } from './decorators'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('StorageService') private readonly storage: StorageService,
  ) {}

  @Get('/')
  get(): string {
    return 'Server is alive!'
  }

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('/helloWithEnv')
  @Protected()
  getHelloWithEnv(): string {
    return this.appService.getHelloWithEnv()
  }

  @Post('/testDb')
  async testDb(): Promise<string> {
    const user = await this.storage.users.getOne('5cedc0a53765591700725069')
    console.log(user)
    return 'test database'
  }
}
