// @flow

import { AUTH_WHITELIST, GRAPHQL_ENDPOINT } from '@constants/api'
import TokenModel from '@models/Token'
import type { User } from '@models/User'
import database from '@server/database'

const authMiddleware: express$Middleware = async (
  request: express$Request,
  response: express$Response,
  next: express$NextFunction
) => {
  if (AUTH_WHITELIST.indexOf(request.path) !== -1) {
    return next()
  }

  if (
    typeof request.headers.authorization === 'undefined' ||
    request.headers.authorization === null
  ) {
    if (request.path === GRAPHQL_ENDPOINT) {
      request.user = null

      return next()
    } else {
      return response
        .status(401)
        .send('No credentials provided, please login to access this page')
    }
  }

  const regexp = new RegExp('^(Bearer) (.*)')
  const regexMatch: Array<string> = regexp.exec(request.headers.authorization)

  if (regexMatch[2] !== null) {
    const rawToken = regexMatch[2]

    const token = await TokenModel.checkToken(rawToken)

    if (token !== null) {
      console.log('coucou')
      const userArray: Array<User> = await database('users').where({
        id: token.userId
      })

      if (userArray.length) {
        request.token = rawToken
        request.user = userArray[0]

        return next()
      }
    }

    return response
      .status(403)
      .send(
        'Invalid authentication token provided. Please try logging in again'
      )
  }
}

export default authMiddleware
