// @flow
import { promisify } from 'util'
import redis from 'redis'

const client = redis.createClient()
client.on('error', error => console.error('Redis error:', error))

const METHODS_TO_PROMISIFY = ['set', 'get', 'del']
const promisifiedClient = METHODS_TO_PROMISIFY.reduce((acc, key) => {
  acc[key] = promisify(client[key].bind(client))

  return acc
}, {})

export default promisifiedClient
