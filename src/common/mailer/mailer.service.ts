import { Injectable, Inject } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

import { ConfigService } from '../config/config.service'

export interface IMailerConfiguration {
  email: string
  password: string
}

@Injectable()
export class MailerService {

  private transporter: nodemailer.Transporter
  private configuration: IMailerConfiguration

  constructor(
    email: string,
    password: string,
    @Inject('ConfigService') private config: ConfigService,
  ) {
    this.configuration = {
      email,
      password,
    }
  }

  public init = async () => {
    const { config } = this
    this.transporter = nodemailer.createTransport({
      ...config,
    })
  }
}
