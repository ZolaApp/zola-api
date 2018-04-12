// @flow
import server from '@server/index'

const port = process.env.HTTP_PORT || 3001

const app = server()
app.listen(port)

process.on('unhandledRejection', (reason: Error, promise: Promise<string>) => {
  console.error('Unhandled rejection at:', promise, 'Reason:', reason)
})
