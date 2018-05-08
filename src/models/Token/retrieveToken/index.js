// @flow
import database from '@database/index'
import type User from '@models/User'
import type Token from '@models/Token'

const retrieveToken = async (user: User): Promise<Token | null> => {
  const token: Array<Token> = await database('tokens').where({
    userId: user.id
  })

  return token[0] || null
}

export default retrieveToken
