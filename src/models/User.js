// @flow
import database from '@server/database'

export type User = {
  id: number,
  email: string
}

export const getUsers = (): Array<User> => database.select().from('users')
