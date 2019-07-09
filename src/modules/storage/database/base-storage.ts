import { FirestoreClient } from './firestore-client'

export abstract class BaseStorage {

  protected fs: any
  protected fsClient: FirestoreClient

  constructor() {
    this.fsClient = new FirestoreClient()
  }

  public async connect() {
    this.fs = await this.fsClient.connect()
    console.log('[Base Storage] Database client connected.')
  }

  public async close() {
    console.log('[Base Storage] Database client disconnected.')
  }
}
