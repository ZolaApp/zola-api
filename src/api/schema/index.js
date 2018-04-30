// @flow
import { makeExecutableSchema } from 'graphql-tools'
import UserAPI from '@api/User'
import ProjectAPI from '@api/Project'
import ProjectUserAPI from '@api/ProjectUser'
import Root from './types/Root.graphql'
import Scalars from './scalars/scalars.graphql'
import ScalarsResolvers from './scalars/resolvers'
import Status from './types/Status.graphql'
import ValidationError from './types/ValidationError.graphql'
import User from './types/User.graphql'
import Project from './types/Project.graphql'
import ProjectUser from './types/ProjectUser.graphql'

const typeDefs = [
  Root,
  Scalars,
  Status,
  ValidationError,
  User,
  Project,
  ProjectUser
]
const resolvers = [ScalarsResolvers, UserAPI, ProjectAPI, ProjectUserAPI]
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
