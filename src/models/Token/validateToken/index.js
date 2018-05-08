// @flow
import database from '@database/index'
import type Token from '@models/Token'

const checkToken = async (inputToken: string): Promise<Token | null> => {
  const token: Array<Token> = await database('tokens').where({
    token: inputToken
  })

  return token[0] || null
}

export default checkToken
