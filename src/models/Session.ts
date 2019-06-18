import { copyFields } from '../common/utils'

export class Session {
  email: string
  roles: { [key: string]: any }

  constructor(data?: any) {
    copyFields(data, this)
  }
}