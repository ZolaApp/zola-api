// @flow
import Project from '@models/Project'
import { AUTHENTICATION_ERROR_NO_USER } from '@constants/errors'

type Context = {
  request: express$Request
}

type GetProjectArgs = {
  projectId: string
}

const resolver = async (
  _: any,
  { projectId }: GetProjectArgs,
  { request }: Context
) => {
  if (request.user === null) {
    throw new Error(AUTHENTICATION_ERROR_NO_USER)
  }

  const project = await Project.query()
    .eager('locales')
    .findOne({ id: projectId, ownerId: request.user.id })

  return project
}

export default resolver
