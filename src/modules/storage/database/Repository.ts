import { Db, ObjectID } from 'mongodb'

export class Repository<T> {
  constructor(
    private db: Db,
    private name: string
  ) {}

  public async getOne(id: string): Promise<any> {
    if (!ObjectID.isValid(id)) return null
    const query = {
      _id: new ObjectID(id)
    }
    return await this.db.collection(this.name).findOne(query)
  }

  public async getAll(): Promise<any[]> {
    return await this.db.collection(this.name).find().toArray()
  }
}
