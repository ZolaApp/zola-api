// @flow
export const GRAPHQL_PATH = '/graphql'
export const GRAPHIQL_PATH = '/graphiql'
export const CDN_PREFIX = '/cdn'
export const CDN_DOWNLOAD_PATH = `${CDN_PREFIX}/:cdnToken/download`
export const CDN_PATH = `${CDN_PREFIX}/:cdnToken/:localeCode`

export const AUTH_MIDDLEWARE_WHITELIST = [GRAPHIQL_PATH, CDN_PREFIX]
