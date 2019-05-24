import { ConfigService } from '../config/config.service'
import { MailerService } from './mailer.service'

export const mailerProviders = [
  {
    provide: 'Mailer',
    useFactory: (config: ConfigService,): MailerService => {
      return new MailerService(config.get('NODEMAILER_EMAIL'), config.get('NODEMAILER_PASSWORD')) //think about paremeters and injection problem
    },
    inject: ['ConfigSerivce']
  }
]
