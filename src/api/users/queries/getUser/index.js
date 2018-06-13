// @flow
import { AUTHENTICATION_ERROR_NO_USER } from '@constants/errors'

type Context = {
  request: express$Request
}

const resolver = async (_: any, args: any, { request }: Context) => {
  if (request.user === null) {
    throw new Error(AUTHENTICATION_ERROR_NO_USER)
  }

  return request.user
}

export default resolver
