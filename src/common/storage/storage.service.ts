import { Injectable, Inject } from '@nestjs/common'
import * as admin from 'firebase-admin'

@Injectable()
export class StorageService {
  constructor(
    @Inject() public fs: admin.firestore.Firestore
  ) {}

}
