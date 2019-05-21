import { Injectable } from '@nestjs/common'
import { ConfigService } from './common/Config/config.service'

@Injectable()
export class AppService {

  constructor(private readonly config: ConfigService) {}

  getHello(): string {
    return 'Hello World!'
  }

  getHelloWithEnv(): string {
    return `Hello World ${this.config.get('test')}`
  }
}
