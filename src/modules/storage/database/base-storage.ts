import { DatabaseClient } from './database-client'
import { FirestoreClient } from './firestore-client'

export abstract class BaseStorage {

  protected db: any
  protected dbClient: DatabaseClient
  protected fs: any
  protected fsClient: FirestoreClient

  constructor() {
    this.dbClient = new DatabaseClient()
    this.fsClient = new FirestoreClient()
  }

  public async connect() {
    this.db = await this.dbClient.connect()
    this.fs = await this.fsClient.connect()
    console.log('[Base Storage] Database client connected.')
  }

  public async close() {
    if (this.dbClient && this.dbClient.connected) {
      await this.dbClient.close()
      console.log('[Base Storage] Database client disconnected.')
    }
  }
}
