import { MongoClient, Db } from 'mongodb'

export class DatabaseClient{
  private db: Db
  private mongoClient: MongoClient
  public connected: boolean = false

  public async connect(): Promise<Db> {
    console.log('CONNECTION')
    while (!this.connected) {
      try {
        this.mongoClient = await MongoClient.connect('mongodb://localhost/nest', { useNewUrlParser: true });
        this.db = this.mongoClient.db()
        this.connected = true

      } catch(err) {
        console.log(err.message)
        console.log('Retrying connection')
        setTimeout(() => this.connect(), 1000)
      }
    }
    return this.db
  }

  public async close(): Promise<any> {
    return await this.mongoClient.close()
  }

}