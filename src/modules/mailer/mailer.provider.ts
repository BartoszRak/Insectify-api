import { MailerService } from './mailer.service'
import { nodemailerCredentials } from '../../config'

export const mailerProviders = [
  {
    provide: 'MainMailer',
    useFactory: (): MailerService => {
      const nodemailerEmail = nodemailerCredentials.email
      const nodemailerPassword = nodemailerCredentials.password
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
  }
]
