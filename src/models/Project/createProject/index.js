// @flow
import slugify from 'slug'
import validateString from '@helpers/validateString'
import Project from '@models/Project'
import { type ValidationError } from '@types/ValidationError'
import Locale from '@models/Locale'

const validateName = validateString({ type: 'name', maxLength: 50 })
const validateDescription = validateString({
  type: 'description',
  minLength: 0,
  maxLength: 255
})

export type CreateProjectArgs = {
  name: string,
  description: string,
  defaultLocaleId: string,
  ownerId: string
}

type CreateProjectResponse = {
  project?: Project,
  errors: Array<ValidationError>
}

const createProject = async ({
  name,
  description = '',
  ownerId,
  defaultLocaleId
}: CreateProjectArgs): Promise<CreateProjectResponse> => {
  const errors: Array<ValidationError> = []
  const trimmedName = name.trim()
  const nameValidation = validateName(trimmedName)

  if (!nameValidation.isValid) {
    errors.push({ field: 'name', message: nameValidation.error })
  }

  const slug = slugify(trimmedName, { lower: true })
  const existingProjectsWithSlug = await Project.query()
    .where({ ownerId, slug })
    .count()
    .first()
  const isDuplicateSlug = existingProjectsWithSlug.count > 0

  if (isDuplicateSlug) {
    errors.push({
      field: 'name',
      message:
        'It seems like you’re alreading using this name for another project. Please use another one.'
    })
  }

  const trimmedDescription = description.trim()
  const descriptionValidation = validateDescription(trimmedDescription)

  if (!descriptionValidation.isValid) {
    errors.push({ field: 'description', message: descriptionValidation.error })
  }

  if (errors.length > 0) {
    return { errors }
  }

  const locale = await Locale.query().findById(defaultLocaleId)

  if (!locale) {
    throw new Error('This locale doesn’t exist')
  }

  try {
    const project = await Project.query().insertGraphAndFetch(
      {
        name: trimmedName,
        slug,
        description: trimmedDescription,
        locales: [locale],
        ownerId
      },
      { relate: true }
    )

    return { project, errors: [] }
  } catch (error) {
    errors.push({ field: 'generic', message: error.message })

    return { errors }
  }
}

export default createProject
