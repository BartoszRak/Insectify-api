import { SetMetadata } from '@nestjs/common'

const Permissions = (permissionsList: string[]) => SetMetadata('requiredPermissions', permissionsList)

export default Permissions