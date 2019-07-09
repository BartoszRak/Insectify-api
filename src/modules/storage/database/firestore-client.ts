import * as admin from 'firebase-admin'

import { firebaseConfig } from '../../../config'
import * as serviceAccountJson from './service-account-dev.json'

const serviceAccount: any = { ...serviceAccountJson }

export class FirestoreClient{
  private fs: admin.firestore.Firestore
  private app: admin.app.App
  public connected: boolean = false

  public async connect(connectionInterval: number = 5000): Promise<admin.firestore.Firestore> {
    while (!this.connected) {
      try {
        this.app = await admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: firebaseConfig.databaseURL,
        }, 'insectify-api-dev')
        this.fs = this.app.firestore()
        this.connected = true

      } catch(err) {
        console.log(`[Firestore Client] Error: ${err.message}`)
        console.log(`[Firestore Client] Retrying connection in ${connectionInterval} ms...`)
        await new Promise((resolve: any, reject: any) => {
          try {
            setTimeout(() => {
              this.connect()
              resolve()
            }, connectionInterval)
          } catch(err) {
            reject()
          }
        })
        
      }
    }
    return this.fs
  }
}
