// @flow
import bcrypt from 'bcrypt'
import database from '@server/database'

const BCRYPT_SALT_ROUNDS = process.env.NODE_ENV === 'test' ? 1 : 10

export type User = {
  id: number,
  email: string,
  name: string,
  passwordHash: string
}

export type CreateUserArgs = {
  email: string,
  name: string,
  passwordPlain: string
}

const createUser = async ({
  email,
  name,
  passwordPlain
}: CreateUserArgs): Promise<User> => {
  const passwordHash: string = await bcrypt.hash(
    passwordPlain,
    BCRYPT_SALT_ROUNDS
  )
  const savedUser: Array<User> = await database('users')
    .insert({ email, name, passwordHash })
    .returning('*')

  return savedUser[0]
}

export default {
  createUser
}
