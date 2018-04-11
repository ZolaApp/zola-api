import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'

const port = process.env.HTTP_PORT || 3001
const server = express()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(compression())

server.listen(port)

process.on('unhandledRejection', reason => {
  console.error('UNHANDLED_REJECTION')
  console.error(reason)
})
