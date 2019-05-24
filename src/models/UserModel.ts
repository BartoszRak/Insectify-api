import { copyFields } from '../common/Utils'

export class UserFsModel {
  public email: string = undefined
  public salt: string = undefined
  public passwordHash: string = undefined

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