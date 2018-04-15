// @flow
import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import indexRoute from './routes'

export default (): express$Application => {
  const app = express()

  // Middlewares
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use((compression(): express$Middleware))

  // Routes
  app.get('/', indexRoute)

  return app
}
