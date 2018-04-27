// @flow
import slugify from 'slugify'
import type { Project } from '@models/Project'
import type { ValidationError } from '@types/ValidationError'
import database from '@server/database'
import ProjectUserModel from '@models/ProjectUser'
import validateName from '@helpers/validateName'

export type CreateProjectArgs = {
  name: string,
  description: string,
  userId: string
}

export type CreateProjectResponse = {
  project?: Project,
  errors: Array<ValidationError>
}

const createProject = async ({
  name,
  description = '',
  userId
}: CreateProjectArgs): Promise<CreateProjectResponse> => {
  const errors: Array<ValidationError> = []
  const trimmedName = name.trim()
  const trimmedDescription = description.trim()
  const nameValidation = validateName(trimmedName)

  if (!nameValidation.isValid) {
    errors.push({ field: 'name', message: nameValidation.error })
  }

  const slug = slugify(trimmedName, { lower: true })

  if (errors.length) {
    return { errors }
  }

  const savedProject: Array<Project> = await database('projects')
    .insert({ name: trimmedName, slug, description: trimmedDescription })
    .returning('*')

  await ProjectUserModel.createProjectUser({
    projectId: savedProject[0].id,
    userId,
    role: 'OWNER'
  })

  return { project: savedProject[0], errors: [] }
}

export default createProject
