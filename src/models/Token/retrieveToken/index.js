// @flow
import type User from '@models/User'
import Token from '@models/Token'

const retrieveToken = async (user: User): Promise<Token | null> => {
  const token: Token = await Token.query().findOne({
    userId: user.id
  })

  return token || null
}

export default retrieveToken
