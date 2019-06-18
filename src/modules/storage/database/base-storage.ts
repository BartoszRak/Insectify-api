import { DatabaseClient } from './database-client'

export abstract class BaseStorage {

  protected db: any
  protected dbClient: DatabaseClient

  constructor() {
    this.dbClient = new DatabaseClient()
  }

  public async connect() {
    this.db = await this.dbClient.connect()
    console.log('[Base Storage] Database client connected.')
  }

  public async close() {
    if (this.dbClient && this.dbClient.connected) {
      await this.dbClient.close()
      console.log('[Base Storage] Database client disconnected.')
    }
  }
}
