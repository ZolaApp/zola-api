// @flow
import createToken from './createToken'
import retrieveToken from './retrieveToken'
import validateToken from './validateToken'

export type Token = {
  id: string,
  token: string,
  userId: string
}

export default {
  createToken,
  retrieveToken,
  validateToken
}
