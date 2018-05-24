// @flow
import TranslationKey from '@models/TranslationKey'
import type { ValidationError } from '@types/ValidationError'
import validateString from '@helpers/validateString'
import Project from '@models/Project'

const validateKey = validateString({
  type: 'translation key',
  minLength: 1,
  maxLength: 55
})

export type AddTranslationKeyToProjectArgs = {
  key: string,
  projectId: string,
  ownerId: string
}

type AddTranslationKeyToProjectResponse = {
  project?: Project,
  errors: Array<ValidationError>
}

const createTranslationKey = async ({
  key,
  projectId,
  ownerId
}: AddTranslationKeyToProjectArgs): Promise<
  AddTranslationKeyToProjectResponse
> => {
  const errors: Array<ValidationError> = []
  const keyValidation = validateKey(key)

  //  First some authorization stuff
  const project = await Project.query()
    .findById(projectId)
    .eager('translationKeys')

  console.log(project)

  if (!project || (project && project.ownerId !== ownerId)) {
    errors.push({ field: 'generic', message: 'This project was not found' })
  }

  if (!keyValidation.isValid) {
    errors.push({ field: 'key', message: keyValidation.error })
  }

  if (errors.length > 0) {
    return { errors }
  }

  // Saving key
  try {
    const translationKey = new TranslationKey(key, project)
    project.translationKeys.push(translationKey)

    const updatedProject = await Project.query().upsertGraphAndFetch(project)

    return { project: updatedProject, errors }
  } catch (err) {
    throw new Error(`Mr. Stark, I'm not feeling so well...`)
  }
}

export default createTranslationKey
