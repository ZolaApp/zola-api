// @flow
import ProjectModel from '@models/Project'
import type { CreateProjectArgs } from '@models/Project'

const resolver = async (_: any, args: CreateProjectArgs) => {
  const { errors, project } = await ProjectModel.createProject(args)

  if (errors.length > 0) {
    return { status: 'FAILURE', errors }
  }

  return { status: 'SUCCESS', project, errors }
}

export default resolver
