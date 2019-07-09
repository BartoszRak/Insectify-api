import * as admin from 'firebase-admin'

import { BaseModel } from './base-model'
import { FirestoreWhere } from '../interfaces/firestore-where.interface'

export class FirestoreRepository<T extends BaseModel> {
  constructor(
    private fs: admin.firestore.Firestore,
    private name: string
  ) {}

  private mapToModel(data: any) {
    if (!data) return null
    return { 
      id: data.ref.id,
      ...data.data(),
    }
  }

  public onChange(callback: any): any {
    return this.fs.collection(this.name).onSnapshot((snapshot: admin.firestore.QuerySnapshot) => {
      callback(snapshot.docs.map((doc: any) => this.mapToModel(doc)))
    })
  }

  public async getOne(id: string): Promise<T> {
    if (!id) return null
    const result: any = await this.fs.collection(this.name).doc(id).get()
    return result.data()
  }

  public async getList(options: { limit: number, where: FirestoreWhere[] } = { limit: 25, where: [] }): Promise<T[]> {
    const { limit, where } = options
    const query = this.fs.collection(this.name)
    if (where) {
      where.forEach((whereStatement: any) => {
        const { field, by, value } = whereStatement
        query.where(field, by, value)
      })
    }
    if (limit) {
      query.limit(limit)
    }
    const results: any = await query.get()
    return results.docs.map((doc: any) => this.mapToModel(doc))
  }

  public async getAll(options: { where: FirestoreWhere[] } = { where: [] }): Promise<T[]> {
    const { where } = options
    const query = this.fs.collection(this.name)
    if (where) {
      where.forEach((whereStatement: any) => {
        const { field, by, value } = whereStatement
        query.where(field, by, value)
      })
    }
    const results: any = await query.get()
    return results.docs.map((doc: any) => this.mapToModel(doc))
  }

  public async insertOne(data: T): Promise<T | any> {
    const toInsert: T = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result: any = await this.fs.collection(this.name).add(toInsert)
    const created: any = await this.getOne(result.id)
    return { 
      ...created,
      id: result.id,
    }
  }

  public async updateOne(data: T) {
    const docToUpdateId: string = data.id
    delete data.id
    const toUpdate: T = {
      ...data,
      updatedAt: new Date(),
    }
    await this.fs.collection(this.name).doc(docToUpdateId).update(toUpdate)
    const updated: any = await this.getOne(docToUpdateId)
    return {
      ...updated,
      id: docToUpdateId,
    }
  }
}