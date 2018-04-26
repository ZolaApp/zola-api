// @flow
import { createHash } from 'crypto'
import type { User } from '@models/User'
import type { Token } from '@models/Token'
import type { ValidationError } from '@types/ValidationError'
import database from '@database/index'

export type CreateTokenResponse = {
  token: Token | null,
  errors: Array<ValidationError>
}

const createTokenString = (user: User): string => {
  const now = Date.now()
  const hash = createHash('sha256')
  const hashedEmail = hash.update(`${user.email}${now}`).digest('hex')

  return Buffer.from(`${hashedEmail}-${now})`).toString('base64')
}

const createToken = async (user: User): Promise<CreateTokenResponse> => {
  if (user === null) {
    return {
      errors: [{ field: 'user', message: 'User should be defined' }],
      token: null
    }
  }

  const tokenString: string = createTokenString(user)
  const savedToken: Array<Token> = await database('tokens').insert({
    token: tokenString,
    userId: user.id
  })

  return { token: savedToken[0], errors: [] }
}

export default createToken
