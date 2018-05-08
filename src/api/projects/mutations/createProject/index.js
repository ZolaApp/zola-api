// @flow
import createProject from '@models/Project/createProject'
import type { CreateProjectArgs } from '@models/Project/createProject'

const resolver = async (_: any, args: CreateProjectArgs) => {
  const { errors, project } = await createProject(args)

  if (errors.length > 0) {
    return { status: 'FAILURE', errors }
  }

  return { status: 'SUCCESS', project, errors }
}

export default resolver
