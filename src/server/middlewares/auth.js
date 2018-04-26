// @flow
import { AUTH_MIDDLEWARE_WHITELIST, GRAPHQL_PATH } from '@constants/routes'
import TokenModel from '@models/Token'
import type { User } from '@models/User'
import database from '@server/database'

const auth: express$Middleware = async (
  request: express$Request,
  response: express$Response,
  next: express$NextFunction
) => {
  if (AUTH_MIDDLEWARE_WHITELIST.includes(request.path)) {
    return next()
  }

  if (!request.header('Authorization')) {
    if (request.path === GRAPHQL_PATH) {
      request.user = null

      return next()
    }

    return response
      .status(401)
      .send('No credentials provided, please login to access this page')
  }

  const [, rawToken] = (request.header('Authorization') || '').split(' ')

  if (rawToken !== null) {
    const token = await TokenModel.validateToken(rawToken)

    if (token !== null) {
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

export default auth
