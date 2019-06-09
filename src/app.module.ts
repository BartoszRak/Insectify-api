import { Module, NestModule, MiddlewareConsumer, RequestMethod, UnauthorizedException } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { StorageModule } from './modules/storage/storage.module'
import { ConfigModule } from './modules/config/config.module'
import { AuthModule } from './modules/auth/auth.module'
import { LoggerMiddleware } from './middleware/logger.middleware'
import { DateResolver } from './common/scalar-types/date.scalar'
import { get, mapKeys } from 'lodash'
import { join } from 'path'
import * as jwt from 'jsonwebtoken'
import { jwtSecret } from './config'

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    StorageModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      playground: true,
      resolvers: {}, //{ Date: DateResolver },
      installSubscriptionHandlers: true,
      definitions: process.env.STAGE ? {
        path: join(process.cwd(), 'src/graphql.schema.ts'),
        outputAs: 'class',
      } : null,
      formatError: (error) => {
        delete (error.extensions || {}).exception
        return error
      },
      context: ({ req, res, connection }) => {

        let session
        let request
        if (req) {
          request = req
          const headers = mapKeys((request || {}).headers, (value: string, key: string) => key.toLowerCase())
          const authToken = get(headers, 'authorization', null)
          try {
            session = authToken ? jwt.verify(authToken.split(' ')[1], jwtSecret) : null
          } catch (ex) {
            session = null
          }
        } else if (connection) {
          request = connection.context
          session = connection.context.session
        }

        return {
          request,
          session,
        };
      },
      subscriptions: {
        onConnect: (connectionParams, websocket, context) => {
          // tslint:disable-next-line:no-console
          console.log('subscriptions onConnect')
          // all keys to lowercase
          const params = mapKeys(connectionParams, (value: string, key: string) => key.toLowerCase())
          // get `authroization` header
          const authToken = get(params, 'authorization', null)
          if (authToken) {
            const session = jwt.verify(authToken.split(' ')[1], jwtSecret)
            return { session, request: context.request }
          }
          throw new UnauthorizedException()
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      })
  }
}
