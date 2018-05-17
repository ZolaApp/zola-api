// @flow
import addLocaleToProject from '@models/Project/addLocaleToProject'
import type { AddLocaleToProjectArgs } from '@models/Project/addLocaleToProject'
import { AUTHENTICATION_ERROR_NO_USER } from '@constants/errors'

type Context = {
  request: express$Request
}

const resolver = async (
  _: any,
  { localeId, projectId }: AddLocaleToProjectArgs,
  { request }: Context
) => {
  if (request.user === null) {
    throw new Error(AUTHENTICATION_ERROR_NO_USER)
  }

  const { errors, project } = await addLocaleToProject({ localeId, projectId })

  if (errors.length > 0) {
    return { status: 'FAILURE', errors }
  }

  return { status: 'SUCCESS', project, errors }
}

export default resolver
