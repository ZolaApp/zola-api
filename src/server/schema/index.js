// @flow
import { makeExecutableSchema } from 'graphql-tools'
import merge from 'lodash/merge'
import Root from './types/Root.graphql'
import User from './types/User.graphql'
import UserQueries from '@server/queries/User'

const typeDefs = [Root, User]
const resolvers = merge(
  {},
  // Queries
  UserQueries

  // Mutations
  // …
)
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
