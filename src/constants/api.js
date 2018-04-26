// @flow
const API_HOST = process.env.API_HOST || 'localhost'
const HTTP_PORT = process.env.HTTP_PORT || 3001
export const API_HREF = `http://${API_HOST}:${HTTP_PORT}`
export const APP_HREF = process.env.APP_HREF || 'http://localhost:3000'

export const GRAPHQL_PATH = '/graphql'
export const GRAPHIQL_PATH = '/graphiql'

export const LOGIN_PATH = '/login'
export const VALIDATE_EMAIL_PATH = '/validate-email'

export const AUTH_MIDDLEWARE_WHITELIST = [
  GRAPHIQL_PATH,
  LOGIN_PATH,
  VALIDATE_EMAIL_PATH
]
