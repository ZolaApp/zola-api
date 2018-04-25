// @flow

import createToken from './createToken'
import retrieveToken from './retrieveToken'
import checkToken from './checkToken'
export * from './createToken'

export type Token = {
  id: number,
  token: string,
  userId: number,
  table: 'tokens'
}

export default {
  createToken,
  retrieveToken,
  checkToken
}
