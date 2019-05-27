import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

import { AccessGuard } from './services/guards/access/accessGuard'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalGuards(
    new AccessGuard()
  )
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  )
  await app.listen(3000)
}
bootstrap()
