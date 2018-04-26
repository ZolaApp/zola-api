// @flow
import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import compression from 'compression'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import {
  GRAPHQL_PATH,
  GRAPHIQL_PATH,
  LOGIN_PATH,
  VALIDATE_EMAIL_PATH
} from '@constants/api'
import schema from '@api/schema'
import authMiddleware from '@server/middlewares/auth'
import loginRoute from '@server/routes/login'
import validateEmailRoute from '@server/routes/validateEmail'

export default (): express$Application => {
  const app = express()

  // Middlewares
  app.use(helmet())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use((compression(): express$Middleware))
  app.use(authMiddleware)

  // Routes
  app.use(GRAPHQL_PATH, graphqlExpress({ schema }))

  if (process.env.NODE_ENV !== 'production') {
    app.get(GRAPHIQL_PATH, graphiqlExpress({ endpointURL: GRAPHQL_PATH }))
  }

  app.post(LOGIN_PATH, loginRoute)
  app.get(`${VALIDATE_EMAIL_PATH}/:emailValidationToken`, validateEmailRoute)

  return app
}
