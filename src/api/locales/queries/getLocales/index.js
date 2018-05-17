// @flow
import Locale from '@models/Locale'
import { AUTHENTICATION_ERROR_NO_USER } from '@constants/errors'

type Context = {
  request: express$Request
}

const resolver = async (_: any, args: Array<any>, { request }: Context) => {
  if (request.user === null) {
    throw new Error(AUTHENTICATION_ERROR_NO_USER)
  }

  const locales = Locale.query()

  return locales
}

export default resolver
