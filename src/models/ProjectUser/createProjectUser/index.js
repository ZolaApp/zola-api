// @flow
import type { ProjectUser } from '@models/ProjectUser'
import type { ValidationError } from '@types/ValidationError'
import database from '@server/database'

export type CreateProjectUserArgs = {
  projectId: string,
  userId: string,
  role: string
}

export type CreateProjectUserResponse = {
  projectUser?: ProjectUser,
  errors: Array<ValidationError>
}

const createProject = async ({
  projectId,
  userId,
  role
}: CreateProjectUserArgs): Promise<CreateProjectUserResponse> => {
  const errors: Array<ValidationError> = []

  if (errors.length) {
    return { errors }
  }

  const savedProject: Array<ProjectUser> = await database('projects_users')
    .insert({ projectId, userId, role })
    .returning('*')

  return { project: savedProject[0], errors: [] }
}

export default createProject
