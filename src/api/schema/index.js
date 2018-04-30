// @flow
import { makeExecutableSchema } from 'graphql-tools'
import usersAPI from '@api/users'
import projectsAPI from '@api/projects'
import Root from './types/Root.graphql'
import Scalars from './scalars/scalars.graphql'
import ScalarsResolvers from './scalars/resolvers'
import ResponseStatus from './types/ResponseStatus.graphql'
import ValidationError from './types/ValidationError.graphql'
import User from './types/User.graphql'
import Project from './types/Project.graphql'
import ProjectUser from './types/ProjectUser.graphql'

const typeDefs = [
  Root,
  Scalars,
  ResponseStatus,
  ValidationError,
  User,
  Project,
  ProjectUser
]
const resolvers = [ScalarsResolvers, usersAPI, projectsAPI]
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
