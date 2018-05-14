// @flow
import 'dotenv/config'
import server from '@server/index'
import '@database/index' // Init database and Objection.

const port = process.env.HTTP_PORT || 3001
const app = server()
app.listen(port, () => {
  console.info(`✨  Zola API running on port ${port}. ✨`)
})

process.on('unhandledRejection', (reason: Error, promise: Promise<string>) => {
  console.error('Unhandled rejection at:', promise, 'Reason:', reason)
})
