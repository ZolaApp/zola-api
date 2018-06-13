// @flow
import createProject, {
  type CreateProjectArgs
} from '@models/Project/createProject'
import { AUTHENTICATION_ERROR_NO_USER } from '@constants/errors'

type Context = {
  request: express$Request
}

const resolver = async (
  _: any,
  args: CreateProjectArgs,
  { request }: Context
) => {
  if (request.user === null) {
    throw new Error(AUTHENTICATION_ERROR_NO_USER)
  }

  const { errors, project } = await createProject({
    ...args,
    ownerId: request.user.id
  })

  if (errors.length > 0) {
    return { status: 'FAILURE', errors }
  }

  return { status: 'SUCCESS', project, errors }
}

export default resolver
