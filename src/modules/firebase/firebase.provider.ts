import * as admin from 'firebase-admin'

import { ConfigService } from '../config/config.service'
import * as serviceAccountJson from './service-account.json'
const serviceAccount: any = { ...serviceAccountJson }
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
    useFactory: (app: admin.app.App): admin.firestore.Firestore => {
      const fs: admin.firestore.Firestore = app.firestore()
      fs.settings({
        timestampsInSnapshots: true,
      })

      return fs
    },
    inject: ['FirebaseApp'],
  }
]