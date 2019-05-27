import { Injectable, Inject } from '@nestjs/common'
import * as nodemailer from 'nodemailer'


import { MailerConfiguration } from './interfaces/mailerConfiguration.interface'

@Injectable()
export class MailerService {

  private transporter: nodemailer.Transporter

  constructor(
    private configuration: MailerConfiguration
  ) {
    this.init()
  }

  private init = () => {
    const { configuration } = this
    this.transporter = nodemailer.createTransport({
      ...configuration,
    })
  }
  
  async send(options: nodemailer.SendMailOptions): Promise<void | string> {
    if (!this.transporter) throw new Error('Error with transport occured.')
    try {
      const info: string = await this.transporter.sendMail(options)
      return info
    } catch (err) {
      throw new Error(err)
    }
  }
}
