import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from './common2/config/config.service'

@Injectable()
export class AppService {

  constructor(
    @Inject('ConfigService') private readonly config: ConfigService,
    ) {}

  getHello(): string {
    return 'Hello World!'
  }

  getHelloWithEnv(): string {
    return `Hello World ${this.config.get('test')}`
  }
}
