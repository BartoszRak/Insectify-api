import * as admin from 'firebase-admin'

import { firebaseConfig } from '../../config'
import * as serviceAccountJson from './service-account-dev.json'

const serviceAccount: any = { ...serviceAccountJson }
export const firebaseProviders = [
  {
    provide: 'FirebaseApp',
    useFactory: (): admin.app.App => {
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: firebaseConfig.databaseURL,
      }, 'insectify-api-dev')
    },
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
