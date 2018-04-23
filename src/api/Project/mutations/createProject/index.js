// @flow
import ProjectModel from '@models/Project'
import type { CreateProjectArgs, CreateProjectResponse } from '@models/Project'

const resolver = async (
  _: any,
  args: CreateProjectArgs
): Promise<CreateProjectResponse> => {
  const { errors, project } = await ProjectModel.createProject(args)

  if (errors.length > 0) {
    return { errors }
  }

  return { project, errors }
}

export default resolver
