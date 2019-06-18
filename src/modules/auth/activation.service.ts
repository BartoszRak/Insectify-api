import { Injectable, Inject } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { InjectSchedule, Schedule } from 'nest-schedule'

import { NotificationsService } from './notifications.service'
import { StorageService } from '../storage/storage.service'
import { hashPasswordAsync } from '../../common/helpers/PasswordHelper'

import { User } from '../../graphql.schema'

Injectable()
export class ActivationService {
  constructor(
    @Inject('Firestore') private fs: admin.firestore.Firestore,
    @Inject('StorageService') private readonly storage: StorageService,
    @Inject('NotificationsService') private notification: NotificationsService,
    @InjectSchedule() private readonly schedule: Schedule,
  ) {}

  public async requestActivation(email: string): Promise<void> {
    try {
      const { hash: activationToken, salt: activationSalt }: { hash: string, salt: string } = await hashPasswordAsync(email)
      const query: User[] = await this.storage.users.getList({
        limit: 1,
        where: {
          email: {
            $eq: email,
          },
        }
      })

      if (query.length === 0) {
        throw new Error('There is no user with provided email to activate.')
      }

      const user: User = query[0]
      if (user.isEmailConfirmed) {
        throw new Error('User with provided email is already active.')
      }
      
      await this.storage.users.updateOne({
        ...user,
        activationSalt,
      }, {
        _id: {
          $eq: user.id,
        },
      })
      await this.notification.sendActivationEmail(user.email, activationToken)
    } catch(err) {
      throw new Error(`Requesting user activation failed! ${err.message}`)
    }
  }  
}