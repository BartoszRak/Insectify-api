import { ConfigService } from './config.service'

export const configProviders = [
  {
    provide: 'ConfigService',
    useValue: new ConfigService(`./secrets.env`),
  }
]
