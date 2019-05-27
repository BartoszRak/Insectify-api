import { copyFields } from '../common/Utils'

export class UserFsModel {
  public email: string = undefined
  public passwordSalt: string = undefined
  public passwordHash: string = undefined
  public activationSalt: string = undefined
  public isEmailConfirmed: boolean = false
  public roles: { [key: string]: any } = {}

  constructor(data?: any) {
    copyFields(data, this)
  }
}

export class UserSessionModel {
  public email: string = undefined
  public roles: { [key: string]: any } = {}

  constructor(data?: any) {
    copyFields(data, this)
  }
}