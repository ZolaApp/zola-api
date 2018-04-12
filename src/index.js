// @flow
import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import indexRoute from '@routes/index'

const port = process.env.HTTP_PORT || 3001
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((compression(): express$Middleware))

app.get('/', indexRoute)

app.listen(port)

process.on('unhandledRejection', (reason: Error, promise: Promise<string>) => {
  console.error('Unhandled rejection at:', promise, 'Reason:', reason)
})
