import { Injectable, Inject } from '@nestjs/common'
import { InjectSchedule, Schedule } from 'nest-schedule'

import { NotificationsService } from './notifications.service'
import { StorageService } from '../storage/storage.service'
import { hashPasswordAsync } from '../../common/helpers/PasswordHelper'

import { User } from '../../graphql.schema'

Injectable()
export class ActivationService {
  constructor(
    @Inject('StorageService') private readonly storage: StorageService,
    @Inject('NotificationsService') private notification: NotificationsService,
    @InjectSchedule() private readonly schedule: Schedule,
  ) {}

  public async requestActivation(email: string): Promise<User> {
    try {
      const { hash: activationToken, salt: activationSalt }: { hash: string, salt: string } = await hashPasswordAsync(email)
      const query: User[] = await this.storage.users.getList({
        limit: 1,
        where: [
          { field: 'email', by: '==', value: email },
        ]
      })

      if (query.length === 0) {
        throw new Error('There is no user with provided email to activate.')
      }

      const user: User = query[0]
      if (user.isEmailConfirmed) {
        throw new Error('User with provided email is already active.')
      }

      const activatedUser: User = await this.storage.users.updateOne({
        ...user,
        activationSalt,
      })
      await this.notification.sendActivationEmail(user.email, activationToken)
      return activatedUser
    } catch(err) {
      throw new Error(`Requesting user activation failed! ${err.message}`)
    }
  }  
}