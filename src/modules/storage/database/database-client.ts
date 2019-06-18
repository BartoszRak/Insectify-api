import { MongoClient, Db } from 'mongodb'

export class DatabaseClient{
  private db: Db
  private mongoClient: MongoClient
  public connected: boolean = false

  public async connect(connectionInterval: number = 5000): Promise<Db> {
    while (!this.connected) {
      try {
        this.mongoClient = await MongoClient.connect('mongodb://localhost/nest', { useNewUrlParser: true });
        this.db = this.mongoClient.db()
        this.connected = true

      } catch(err) {
        console.log(`[Database Client] Error: ${err.message}`)
        console.log(`[Database Client] Retrying connection in ${connectionInterval} ms...`)
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
    return this.db
  }

  public async close(): Promise<any> {
    await this.mongoClient.close()
    this.connected = false
  }

}
