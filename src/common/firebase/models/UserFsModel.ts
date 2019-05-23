import { copyFields } from '../../../services/Utils'

export class UserFsModel {
  public email: string = undefined
  public salt: string = undefined
  public passwordHash: string = undefined

  constructor(data?: any) {
    copyFields(data, this)
  }
}