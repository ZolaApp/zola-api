// @flow
import createUser from './createUser'
import sendValidationEmail from './sendValidationEmail'
export * from './createUser'

export type User = {
  id: string,
  createdAt: Date,
  updatedAt: Date,
  isValidated: boolean,
  email: string,
  name: string,
  passwordHash: string
}

export default {
  createUser,
  sendValidationEmail
}
