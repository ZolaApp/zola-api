// @flow
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import compression from 'compression'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import {
  GRAPHQL_PATH,
  GRAPHIQL_PATH,
  CDN_DOWNLOAD_PATH,
  CDN_PATH,
  CDN_LOCALES_PATH
} from '@constants/routes'
import schema from '@api/schema'
import authMiddleware from '@server/middlewares/auth'
import { cdnRoute, cdnLocaleRoute } from '@cdn/index'

export default (): express$Application => {
  const app = express()

  // Middlewares
  app.use(helmet())
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use((compression(): express$Middleware))
  app.use(authMiddleware)

  // Routes
  app.use(
    GRAPHQL_PATH,
    graphqlExpress(request => ({
      schema,
      context: {
        // Pass down express’ `request` to the GraphQL context.
        request
      },
      debug: process.env.node_ENV !== 'production'
    }))
  )

  app.get(CDN_LOCALES_PATH, cdnLocaleRoute)
  app.get(CDN_DOWNLOAD_PATH, cdnRoute)
  app.get(CDN_PATH, cdnRoute)

  // Enable GraphiQL in prod env to allow schema exploration
  app.get(GRAPHIQL_PATH, graphiqlExpress({ endpointURL: GRAPHQL_PATH }))

  return app
}
