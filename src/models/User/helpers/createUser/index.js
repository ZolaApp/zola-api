// @flow
import bcrypt from 'bcrypt'
import database from '@server/database'
import type { User } from '@models/User'

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
  const passwordHash: string = await bcrypt.hash(passwordPlain, 10)
  const savedUser: Array<User> = await database('users')
    .insert({ email, name, passwordHash })
    .returning('*')

  return savedUser[0]
}

export default createUser
