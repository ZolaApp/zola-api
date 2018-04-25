// @flow

import database from '@server/database'
import type { Token } from '@models/Token'

const checkToken = async (inputToken: string): Promise<Token | null> => {
  const token: Array<Token> = await database('tokens').where({
    token: inputToken
  })

  if (typeof token[0] === 'undefined') {
    return null
  }

  return token[0]
}

export default checkToken
