import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from './common/Config/config.service'
import { StorageService } from './common/storage/storage.service'

@Injectable()
export class AppService {

  constructor(
    @Inject('ConfigService') private readonly config: ConfigService,
    @Inject('StorageService') private storage: StorageService,
    ) {}

  getHello(): string {
    console.log(this.storage.isStorageService())
    return 'Hello World!'
  }

  getHelloWithEnv(): string {
    return `Hello World ${this.config.get('test')}`
  }
}
