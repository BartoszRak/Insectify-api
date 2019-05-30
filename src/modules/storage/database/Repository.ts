import { Db, ObjectID } from 'mongodb'

export class Repository<T> {
  constructor(
    private db: Db,
    private name: string
  ) {}

  public async getOne(id: string): Promise<any> {
    try {
      if (!ObjectID.isValid(id)) return null
      const query = {
        _id: new ObjectID(id)
      }
      return await this.db.collection(this.name).findOne(query)
    } catch(err) {
      throw new Error(`Database error: ${err.message}`)
    }
  }
}