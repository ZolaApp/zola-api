// @flow

import { createHash } from 'crypto'
import btoa from 'btoa'
import type { User } from '@models/User'
import type { Token } from '@models/Token'
import type { ValidationError } from '@types/ValidationError'
import database from '@server/database'

export type CreateTokenResponse = {
  token: Token | null,
  errors: Array<ValidationError>
}

const createTokenString = (user: User): string => {
  const hash = createHash('sha256')
  const date = new Date()

  hash.update(`${user.email}${date.getTime()}`)
  const hashedEmail = hash.digest('hex')

  return btoa(`${hashedEmail}-${date.getTime()}`)
}

const createToken = async (user: User): Promise<CreateTokenResponse> => {
  const errors: Array<ValidationError> = []

  if (user == null) {
    errors.push({ field: 'user', message: 'User should be defined' })
  }

  if (errors.length) {
    return { errors, token: null }
  }

  const tokenString: string = createTokenString(user)
  console.log(tokenString)
  const savedToken: Array<Token> = await database('tokens')
    .insert({ token: tokenString, userId: user.id })
    .returning('*')

  return { token: savedToken[0], errors: [] }
}

export default createToken
