// @flow
import createUser from './createUser'
export * from './createUser'

export type User = {
  id: string,
  createdAt: Date,
  updatedAt: Date,
  email: string,
  name: string,
  passwordHash: string
}

export default {
  createUser
}
