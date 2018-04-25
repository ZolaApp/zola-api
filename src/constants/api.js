// @flow
const API_HOST = process.env.API_HOST || 'localhost'
const HTTP_PORT = process.env.HTTP_PORT || 3001
export const API_HREF = `http://${API_HOST}:${HTTP_PORT}`
export const APP_HREF = process.env.APP_HREF || 'http://localhost:3000'
export const GRAPHQL_ENDPOINT = '/graphql'
export const GRAPHIQL_ENDPOINT = '/graphiql'
