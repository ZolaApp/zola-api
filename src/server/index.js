// @flow
import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import compression from 'compression'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { GRAPHQL_ENDPOINT, GRAPHIQL_ENDPOINT, AUTH_LOGIN } from '@constants/api'
import auth from '@server/auth'
import schema from '@api/schema'

export default (): express$Application => {
  const app = express()

  // Middlewares
  app.use(helmet())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use((compression(): express$Middleware))
  app.use(auth.authMiddleWare)
  app.post(AUTH_LOGIN, auth.authRouter.login)

  // Routes
  app.use(GRAPHQL_ENDPOINT, graphqlExpress({ schema }))

  if (process.env.NODE_ENV !== 'production') {
    app.get(
      GRAPHIQL_ENDPOINT,
      graphiqlExpress({ endpointURL: GRAPHQL_ENDPOINT })
    )

    app.get('/bla', (request: express$Request, response: express$Response) => {
      response.send(
        `Hello ${request.user.name} connected with token ${request.token}`
      )
    })
  }

  return app
}
