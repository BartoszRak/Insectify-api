import { PermissionsGuard } from './guards/permissions/permissions.guard'
import { APP_GUARD } from '@nestjs/core'

export const appProviders = [
  {
    provide: APP_GUARD,
    useClass: PermissionsGuard,
    inject: ['StorageService']
  },
]