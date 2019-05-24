import { Injectable, Inject } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

export interface IMailerAuth {
  user: string
  pass: string
}

export interface IMailerConfiguration {
  host: string
  port: number
  secure: boolean
  service: string
  auth: IMailerAuth
  tls: {
    rejectUnauthorized: boolean
  }
}

@Injectable()
export class MailerService {

  private transporter: nodemailer.Transporter

  constructor(
    private configuration: IMailerConfiguration
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
