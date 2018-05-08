// @flow
import { promisify } from 'util'
import redis from 'redis'
import redisMock from 'redis-mock'

const client =
  process.env.NODE_ENV === 'test'
    ? redisMock.createClient()
    : redis.createClient(6379, process.env.REDIS_HOST || '127.0.0.1')
client.on('error', error => console.error('Redis error:', error))

const METHODS_TO_PROMISIFY = ['set', 'get', 'del']
const promisifiedClient = METHODS_TO_PROMISIFY.reduce((acc, key) => {
  // $FlowFixMe
  acc[key] = promisify(client[key].bind(client))

  return acc
}, {})

export default promisifiedClient
