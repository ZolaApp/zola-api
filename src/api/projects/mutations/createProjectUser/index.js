// @flow
import ProjectUserModel from '@models/ProjectUser'
import type { CreateProjectUserArgs } from '@models/ProjectUser'

const resolver = async (_: any, args: CreateProjectUserArgs) => {
  const { errors, projectUser } = await ProjectUserModel.createProjectUser(args)

  if (errors.length > 0) {
    return { status: 'FAILURE', errors }
  }

  return { status: 'SUCCESS', projectUser, errors }
}

export default resolver
