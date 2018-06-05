// @flow
import { AUTH_MIDDLEWARE_WHITELIST, GRAPHQL_PATH } from '@constants/routes'
import {
  AUTHENTICATION_ERROR_INVALID_LOGIN,
  AUTHENTICATION_ERROR_NO_USER
} from '@constants/errors'
import validateToken from '@models/Token/validateToken'
import User from '@models/User'

const auth: express$Middleware = async (
  request: express$Request,
  response: express$Response,
  next: express$NextFunction
) => {
  if (AUTH_MIDDLEWARE_WHITELIST.some(path => request.path.includes(path))) {
    return next()
  }

  if (!request.header('Authorization')) {
    if (request.path === GRAPHQL_PATH) {
      request.user = null

      return next()
    }

    return response.status(401).send(AUTHENTICATION_ERROR_NO_USER)
  }

  const [, rawToken] = (request.header('Authorization') || '').split(' ')
  const token = await validateToken(rawToken)

  if (token !== null) {
    const user = await User.query().findOne({ id: token.userId })
    request.user = user

    return next()
  }

  return response.status(403).send(AUTHENTICATION_ERROR_INVALID_LOGIN)
}

export default auth
