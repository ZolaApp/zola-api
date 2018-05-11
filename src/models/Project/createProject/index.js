// @flow
import slugify from 'slugify'
import database from '@database/index'
import validateString from '@helpers/validateString'
import type { Project } from '@models/Project'
import type { ValidationError } from '@types/ValidationError'

const validateName = validateString({ type: 'name', maxLength: 50 })
const validateDescription = validateString({
  type: 'description',
  minLength: 0,
  maxLength: 255
})

export type CreateProjectArgs = {
  name: string,
  description: string,
  ownerId: string
}

type CreateProjectResponse = {
  project?: Project,
  errors: Array<ValidationError>
}

const createProject = async ({
  name,
  description = '',
  ownerId
}: CreateProjectArgs): Promise<CreateProjectResponse> => {
  const errors: Array<ValidationError> = []
  const trimmedName = name.trim()
  const nameValidation = validateName(trimmedName)

  if (!nameValidation.isValid) {
    errors.push({ field: 'name', message: nameValidation.error })
  }

  const trimmedDescription = description.trim()
  const descriptionValidation = validateDescription(trimmedDescription)

  if (!descriptionValidation.isValid) {
    errors.push({ field: 'description', message: descriptionValidation.error })
  }

  if (errors.length > 0) {
    return { errors }
  }

  const slug = slugify(trimmedName, { lower: true })
  const savedProject: Array<Project> = await database('projects')
    .insert({
      name: trimmedName,
      slug,
      description: trimmedDescription,
      ownerId
    })
    .returning('*')

  return { project: savedProject[0], errors: [] }
}

export default createProject
