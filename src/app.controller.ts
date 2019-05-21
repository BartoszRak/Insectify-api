import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  get(): string {
    return 'Server is alive!'
  }

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('/helloWithEnv')
  getHelloWithEnv(): string {
    return this.appService.getHelloWithEnv()
  }
}
