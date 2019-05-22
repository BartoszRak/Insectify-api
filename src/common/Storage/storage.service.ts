import { Injectable } from '@nestjs/common'
import * as admin from 'firebase-admin'

const serviceAccount = require('./service-account.json')
import { ConfigService } from '../Config/config.service'

@Injectable()
export class StorageService {

  private db: admin.firestore.Firestore

  constructor(private readonly config: ConfigService) {
    const fbAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: this.config.get('FIREBASE_DATABASE_URL'),
    })
    this.db = fbAdmin.firestore()
    this.db.settings({ timestampsInSnapshots: true })
  }
}
