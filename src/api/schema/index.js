// @flow
import { makeExecutableSchema } from 'graphql-tools'
import UserAPI from '@api/User'
import ProjectAPI from '@api/Project'
import Root from './types/Root.graphql'
import Scalars from './scalars/scalars.graphql'
import ScalarsResolvers from './scalars/resolvers'
import Status from './types/Status.graphql'
import ValidationError from './types/ValidationError.graphql'
import User from './types/User.graphql'
import Project from './types/Project.graphql'

const typeDefs = [Root, Scalars, Status, ValidationError, User, Project]
const resolvers = [ScalarsResolvers, UserAPI, ProjectAPI]
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
