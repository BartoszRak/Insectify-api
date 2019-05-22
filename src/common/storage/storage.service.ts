import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class StorageService {
  constructor(
    @Inject('Firestore') private fs,
  ) {}

  public async isStorageService(): Promise<boolean> {
    const res: any = await this.fs.collection('users').get()
    console.log(res.docs[0].data().email)
    return true
  }
}