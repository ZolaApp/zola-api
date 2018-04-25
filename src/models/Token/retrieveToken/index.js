// @flow

import database from '@server/database'
import type { User } from '@models/User'
import type { Token } from '@models/Token'

const retrieveToken = async (user: User): Promise<Token | null> => {
  const token: Array<Token> = await database('tokens').where({
    userId: user.id
  })

  if (typeof token[0] === 'undefined') {
    return null
  }

  return token[0]
}

export default retrieveToken
