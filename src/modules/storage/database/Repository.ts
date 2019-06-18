import { Db, ObjectID } from 'mongodb'
import { BaseModel } from './base-model'

export class Repository<T extends BaseModel> {
  constructor(
    private db: Db,
    private name: string
  ) {}

  private mapToModel(data: any): T {
    if (!data) return null
    const { _id, ...obj } = data
    return { ...obj, id: _id }
  }

  public async getOne(id: string): Promise<T> {
    if (!ObjectID.isValid(id)) return null
    const query: { [key: string]: any } = {}
    query._id = new ObjectID(id)
    const result: any = await this.db.collection(this.name).findOne(query)
    return this.mapToModel(result)
  }

  public async getList(options: { limit: number, where: any }): Promise<T[]> {
    const { limit, where = {} } = options
    const baseQuery = this.db.collection(this.name).find(where)
    const results: any[] = limit ? await baseQuery.limit(limit).toArray() : await baseQuery.toArray()
    return results.map((res: any) => this.mapToModel(res))
  }

  public async insertOne(data: T): Promise<T> {
    const toInsert: T = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result: any = await this.db.collection(this.name).insertOne(toInsert)
    const created: T = await this.getOne(result.insertedId.toString())
    return this.mapToModel(created)
  }

  public async updateOne(data: T, where: any): Promise<any> {
    const toUpdate: T = {
      ...data,
      updatedAt: new Date(),
    }
    return await this.db.collection(this.name).updateOne(where, { $set: toUpdate })
  }
}