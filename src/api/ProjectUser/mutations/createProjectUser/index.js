// @flow
import ProjectUserModel from '@models/ProjectUser'
import type {
  CreateProjectUserArgs,
  CreateProjectUserResponse
} from '@models/ProjectUser'

const resolver = async (
  _: any,
  args: CreateProjectUserArgs
): Promise<CreateProjectUserResponse> => {
  const { errors, projectUser } = await ProjectUserModel.createProjectUser(args)

  if (errors.length > 0) {
    return { errors }
  }

  return { projectUser, errors }
}

export default resolver
