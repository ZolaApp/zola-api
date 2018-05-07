// @flow
import { promisify } from 'util'
import redis from 'redis'
import redisMock from 'redis-mock'

const host = process.env.REDIS_HOST || '127.0.0.1'
const port = Number(process.env.REDIS_PORT) || 6379
const client =
  process.env.NODE_ENV === 'test'
    ? redisMock.createClient()
    : redis.createClient({ host, port })
client.on('error', error => console.error('Redis error:', error))

const METHODS_TO_PROMISIFY = ['set', 'get', 'del']
const promisifiedClient = METHODS_TO_PROMISIFY.reduce((acc, key) => {
  // $FlowFixMe
  acc[key] = promisify(client[key].bind(client))

  return acc
}, {})

export default promisifiedClient
