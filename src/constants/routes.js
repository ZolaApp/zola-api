// @flow
export const GRAPHQL_PATH = '/graphql'
export const GRAPHIQL_PATH = '/graphiql'
export const CDN_PATH = '/cdn/:cdnToken/:localeCode'
export const CDN_DOWNLOAD_PATH = `${CDN_PATH}/download`

export const AUTH_MIDDLEWARE_WHITELIST = [
  GRAPHIQL_PATH,
  CDN_PATH,
  CDN_DOWNLOAD_PATH
]
