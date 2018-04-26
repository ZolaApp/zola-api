// @flow
import { makeExecutableSchema } from 'graphql-tools'
import UserAPI from '@api/User'
import Root from './types/Root.graphql'
import ValidationError from './types/ValidationError.graphql'
import User from './types/User.graphql'
import Scalars from './scalars/scalars.graphql'
import ScalarsResolvers from './scalars/resolvers'

const typeDefs = [Root, Scalars, ValidationError, User]
const resolvers = [ScalarsResolvers, UserAPI]
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
