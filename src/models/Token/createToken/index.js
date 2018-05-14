// @flow
import { createHash } from 'crypto'
import type User from '@models/User'
import Token from '@models/Token'

export const generateToken = (email: string): string => {
  const now = Date.now()
  const hash = createHash('sha256')
  const hashedEmail = hash.update(`${email}${now}`).digest('hex')

  return Buffer.from(`${hashedEmail}-${now})`).toString('base64')
}

const createToken = async (user: User): Promise<Token> => {
  const tokenString: string = generateToken(user.email)
  const savedToken: Token = await Token.query().insertAndFetch({
    token: tokenString,
    userId: user.id
  })

  return savedToken
}

export default createToken
