// @flow
import Project from '@models/Project'
import { AUTHENTICATION_ERROR_NO_USER } from '@constants/errors'

type Context = {
  request: express$Request
}

const resolver = async (_: any, args: Array<any>, { request }: Context) => {
  if (request.user === null) {
    throw new Error(AUTHENTICATION_ERROR_NO_USER)
  }

  const projects = await Project.query()
    .eager('locales')
    .where({ ownerId: request.user.id })

  return projects
}

export default resolver
