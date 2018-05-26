// @flow
import { makeExecutableSchema } from 'graphql-tools'
import usersAPI from '@api/users'
import projectsAPI from '@api/projects'
import localesAPI from '@api/locales'
import translationKeysApi from '@api/translationKey'
import Root from './types/Root.graphql'
import Scalars from './scalars/scalars.graphql'
import scalarsResolvers from './scalars/resolvers'
import ResponseStatus from './types/ResponseStatus.graphql'
import ValidationError from './types/ValidationError.graphql'
import User from './types/User.graphql'
import Project from './types/Project.graphql'
import Locale from './types/Locale.graphql'
import TranslationKey from './types/TranslationKey.graphql'
import TranslationValue from './types/TranslationValue.graphql'

const typeDefs = [
  Root,
  Scalars,
  ResponseStatus,
  ValidationError,
  User,
  Project,
  Locale,
  TranslationKey,
  TranslationValue
]
const resolvers = [
  scalarsResolvers,
  usersAPI,
  projectsAPI,
  localesAPI,
  translationKeysApi
]
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
