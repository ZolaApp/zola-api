// @flow
import { createHash } from 'crypto'
import type User from '@models/User'
import Token from '@models/Token'
import type { ValidationError } from '@types/ValidationError'

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
  const savedToken: Token = await Token.query().insertAndFetch({
    token: tokenString,
    userId: user.id
  })

  return { token: savedToken, errors: [] }
}

export default createToken
