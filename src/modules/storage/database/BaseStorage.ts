import { DatabaseClient } from './DatabaseClient'

export abstract class BaseStorage {

  protected db: any
  protected dbClient: DatabaseClient

  constructor() {
    this.dbClient = new DatabaseClient()
    this.connect()
  }

  public async connect() {
    this.db = await this.dbClient.connect()
    await this.initDb()
  }

  public async close() {
    if (this.dbClient && this.dbClient.connected) {
      await this.dbClient.close()
    }
  }

  protected abstract async initDb()
}