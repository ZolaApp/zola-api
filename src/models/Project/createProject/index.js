// @flow
import type { Project } from '@models/Project'
import type { ValidationError } from '@types/ValidationError'
import database from '@server/database'
import ProjectUserModel from '@models/ProjectUser'

export type CreateProjectArgs = {
  name: string,
  slug: string,
  description: string,
  userId: number
}

export type CreateProjectResponse = {
  project?: Project,
  errors: Array<ValidationError>
}

const createProject = async ({
  name,
  slug,
  description,
  userId
}: CreateProjectArgs): Promise<CreateProjectResponse> => {
  const errors: Array<ValidationError> = []
  const trimmedName = name.trim()

  if (errors.length) {
    return { errors }
  }

  const savedProject: Array<Project> = await database('projects')
    .insert({ name: trimmedName, slug, description })
    .returning('*')

  await ProjectUserModel.createProjectUser({
    projectId: savedProject[0].id,
    userId,
    role: 'owner'
  })

  return { project: savedProject[0], errors: [] }
}

export default createProject
