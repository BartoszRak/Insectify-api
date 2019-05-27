import { SetMetadata } from '@nestjs/common'

const Protected = () => SetMetadata('engageProtection', true)

export default Protected