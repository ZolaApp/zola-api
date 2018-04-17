// @flow
import { makeExecutableSchema } from 'graphql-tools'
import merge from 'lodash/merge'
import Root from './types/Root.graphql'
import ValidationError from './types/ValidationError.graphql'
import User from './types/User.graphql'
import UserAPI from '@api/User'

const typeDefs = [Root, ValidationError, User]
const resolvers = merge({}, UserAPI)
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
