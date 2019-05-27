import { UserSessionModel } from '../../../../models/UserModel'

export interface DecodedToken {
  data: {
    user: UserSessionModel
  }
  iat: any,
  exp: any,
}