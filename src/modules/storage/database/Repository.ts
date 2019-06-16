import { Db, ObjectID } from 'mongodb'

interface GetAllOptions {
  limit?: number
}

export class Repository<T> {
  constructor(
    private db: Db,
    private name: string
  ) {}

  public async getOne(id: string): Promise<T> {
    if (!ObjectID.isValid(id)) return null
    const query: { [key: string]: any } = {}
    query._id = new ObjectID(id)
    return await this.db.collection(this.name).findOne(query)
  }

  public async getList(options?: GetAllOptions): Promise<T[]> {
    const { limit } = options
    return await this.db.collection(this.name).find().limit(limit).toArray()
  }

  public async getAll(): Promise<T[]> {
    return await this.db.collection(this.name).find().toArray()
  }
}
