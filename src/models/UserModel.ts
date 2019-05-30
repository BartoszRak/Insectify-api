import { copyFields } from '../common/Utils'

export class UserDbModel {
  public email: string = undefined
  public passwordSalt: string = undefined
  public passwordHash: string = undefined
  public activationSalt: string = undefined
  public isEmailConfirmed: boolean = false

  constructor(data?: any) {
    copyFields(data, this)
  }
}

export class UserSessionModel {
  public email: string = undefined

  constructor(data?: any) {
    copyFields(data, this)
  }
}