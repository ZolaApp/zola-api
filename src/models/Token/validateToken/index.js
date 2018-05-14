// @flow
import database from '@database/index'
import type Token from '@models/Token'

const validateToken = async (token: string): Promise<Token | null> => {
  const retrievedToken: Array<Token> = await database('tokens').where({ token })

  return retrievedToken[0] || null
}

export default validateToken
