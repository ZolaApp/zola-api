// @flow
import { makeExecutableSchema } from 'graphql-tools'
import UserAPI from '@api/User'
import ProjectAPI from '@api/Project'
import Root from './types/Root.graphql'
import ValidationError from './types/ValidationError.graphql'
import User from './types/User.graphql'
import Project from './types/Project.graphql'
import Scalars from './scalars/scalars.graphql'
import ScalarsResolvers from './scalars/resolvers'

const typeDefs = [Root, Scalars, ValidationError, User, Project]
const resolvers = [ScalarsResolvers, UserAPI, ProjectAPI]
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
