interface MailerAuth {
  user: string
  pass: string
}


export interface MailerConfiguration {
  host: string
  port: number
  secure: boolean
  service: string
  auth: MailerAuth
  tls: {
    rejectUnauthorized: boolean
  }
}