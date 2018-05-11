// @flow
import { createHash } from 'crypto'
import type { User } from '@models/User'
import type { Token } from '@models/Token'
import database from '@database/index'

export const generateToken = (email: string): string => {
  const now = Date.now()
  const hash = createHash('sha256')
  const hashedEmail = hash.update(`${email}${now}`).digest('hex')

  return Buffer.from(`${hashedEmail}-${now})`).toString('base64')
}

const createToken = async (user: User): Promise<Token> => {
  const tokenString: string = generateToken(user.email)
  const savedToken: Array<Token> = await database('tokens')
    .insert({
      token: tokenString,
      userId: user.id
    })
    .returning('*')

  return savedToken[0]
}

export default createToken
