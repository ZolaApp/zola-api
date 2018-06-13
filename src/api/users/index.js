// @flow
import createUser from './mutations/createUser'
import loginUser from './mutations/loginUser'
import getUser from './queries/getUser'

export default {
  Mutation: {
    createUser,
    loginUser
  },
  Query: {
    getUser
  }
}
