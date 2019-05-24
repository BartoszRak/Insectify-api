import { ConfigService } from '../config/config.service'
import { MailerService } from './mailer.service'

export const mailerProviders = [
  {
    provide: 'MainMailer',
    useFactory: (config: ConfigService): MailerService => {
      const nodemailerEmail = config.get('NODEMAILER_EMAIL')
      const nodemailerPassword = config.get('NODEMAILER_PASSWORD')
      return new MailerService({
        host: 'smtp.gmail.com',
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
          pass: nodemailerPassword,
          user: nodemailerEmail,
        },
        tls:{
          rejectUnauthorized: false
        }
      })
    },
    inject: ['ConfigService']
  }
]
