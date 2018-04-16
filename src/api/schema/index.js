// @flow
import { makeExecutableSchema } from 'graphql-tools'
import Root from './types/Root.graphql'
import ValidationError from './types/ValidationError.graphql'
import User from './types/User.graphql'
import UserAPI from '@api/User'

const typeDefs = [Root, ValidationError, User]
const resolvers = [UserAPI]
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
