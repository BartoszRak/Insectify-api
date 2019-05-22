import * as admin from 'firebase-admin'

import { ConfigService } from '../config/config.service'
const serviceAccount = require('./service-account.json')

export const firebaseProviders = [
  {
    provide: 'FirebaseApp',
    useFactory: (config: ConfigService): admin.app.App => {
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: config.get('FIREBASE_DATABASE_URL'),
      }, 'insectify-api-dev')
    },
    inject: ['ConfigService'],
  }, {
    provide: 'Firestore',
    useFactory: (app: admin.app.App): any => {
      const fs = app.firestore()
      fs.settings({
        timestampsInSnapshots: true,
      })

      return fs
    },
    inject: ['FirebaseApp'],
  }
]
