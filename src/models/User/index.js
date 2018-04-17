// @flow
import createUser from './helpers/createUser'
export * from './helpers/createUser'

export type User = {
  id: number,
  email: string,
  name: string,
  passwordHash: string
}

export default {
  createUser
}
