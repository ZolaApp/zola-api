// @flow
import createUser from './createUser'
export * from './createUser'

export type User = {
  id: number,
  email: string,
  name: string,
  passwordHash: string
}

export default {
  createUser
}
