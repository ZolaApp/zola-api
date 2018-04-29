// @flow
export const GRAPHQL_PATH = '/graphql'
export const GRAPHIQL_PATH = '/graphiql'

export const LOGIN_PATH = '/login'
export const VALIDATE_EMAIL_PATH = '/validate-email'

export const AUTH_MIDDLEWARE_WHITELIST = [
  GRAPHIQL_PATH,
  LOGIN_PATH,
  VALIDATE_EMAIL_PATH
]
