import { Injectable, Inject } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { InjectSchedule, Schedule } from 'nest-schedule'

import { NotificationsService } from './notifications.service'
import { hashPasswordAsync } from '../../common/helpers/PasswordHelper'
import { UserFsModel } from '../../models'

Injectable()
export class ActivationService {
  constructor(
    @Inject('Firestore') private fs: admin.firestore.Firestore,
    @Inject('NotificationsService') private notification: NotificationsService,
    @InjectSchedule() private readonly schedule: Schedule,
  ) {}

  public async requestActivation(email: string): Promise<void> {
    try {
      const { hash: activationToken, salt: activationSalt }: { hash: string, salt: string } = await hashPasswordAsync(email)
      const query: any = await this.fs.collection('users').where('email', '==', email).limit(1).get()

      if (query.docs.length === 0) {
        throw new Error('There is no user with provided email to activate.')
      }

      const user: UserFsModel = new UserFsModel(query.docs[0].data())
      const userId = query.docs[0].ref.id

      if (user.isEmailConfirmed) {
        throw new Error('User with provided email is already active.')
      }

      await this.fs.collection('users').doc(userId).update({
        activationSalt,
      })
      await this.notification.sendActivationEmail(user.email, activationToken)

      this.schedule.scheduleTimeoutJob('activation-token-expiration', 1000 * 60 * 30, (): any => {
        this.fs.collection('users').doc(userId).update({
          activationSalt: null,
        })
      })
    } catch(err) {
      throw new Error('Requesting user activation failed!')
    }
  }  
}