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
  { request }: Context,
  ast: any
) => {
  if (request.user === null) {
    throw new Error(AUTHENTICATION_ERROR_NO_USER)
  }

  const project = await Project.query()
    .eager('[locales, translationKeys]')
    .findOne({ id: projectId, ownerId: request.user.id })

  if (!project) {
    throw new Error('This project was not found')
  }

  return project
}

export default resolver
