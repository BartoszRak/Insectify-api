import { Injectable, Inject } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

import { MailerService } from '../../services/mailer/mailer.service'

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('MainMailer') private mailer: MailerService,
  ) {}

  public sendRegistrationEmail = async (email: string, activationToken: string): Promise<void> => {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        date: new Date(),
        from: 'Insectify Shop',
        headers: {
          'Content-type': 'text/html; charset=UTF-8',
        },
        html: `
        <h1>Insectiy Shop</h1>
        <h2>Your account has been created!</h2>
        <br />
        <h3>Activaiton link: <a href="https://bartoszrak.com?accountToActivate=${email}&activationToken=${activationToken}">Click to activate your account</a></h3>
        `,
        priority: 'normal',
        subject: 'Insectify - Your account has been created!',
        to: email,
      }
      
      await this.mailer.send(mailOptions)
    } catch(err) {
      throw new Error(err)
    }
  }
}