// @flow
import createToken from './createToken'
import retrieveToken from './retrieveToken'
import validateToken from './validateToken'
export * from './createToken'

export type Token = {
  id: number,
  token: string,
  userId: number
}

export default {
  createToken,
  retrieveToken,
  validateToken
}
