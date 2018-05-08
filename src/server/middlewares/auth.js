// @flow
import { AUTH_MIDDLEWARE_WHITELIST, GRAPHQL_PATH } from '@constants/routes'
import validateToken from '@models/Token/validateToken'
import User from '@models/User'

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
    const token = await validateToken(rawToken)

    if (token !== null) {
      const user: User = await await User.query().findOne({ id: token.userId })

      if (user !== null) {
        request.token = rawToken
        request.user = user

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
